import { NextResponse } from "next/server";

import {
  getKeystaticGitHubAccessToken,
  getKeystaticGitHubUser,
} from "../../../../lib/adminAuth";
import {
  PRODUCT_BRANDS,
  PRODUCT_BUCKET,
  isSafeProductPathPart,
  productImagePath,
  getProductStorage,
} from "../../../../lib/productAdmin";
import { readCloudProduct, updateCloudProductImageCount } from "../../../../lib/keystaticCloud";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function requireAdmin(request: Request) {
  const user = await getKeystaticGitHubUser(request);
  const token = await getKeystaticGitHubAccessToken(request);
  if (!user || !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function parseImageParams(request: Request) {
  const url = new URL(request.url);
  const brand = url.searchParams.get("brand") ?? "";
  const sku = url.searchParams.get("sku") ?? "";
  const slot = Number(url.searchParams.get("slot"));

  if (!PRODUCT_BRANDS.has(brand)) return { error: "Invalid brand" } as const;
  if (!isSafeProductPathPart(sku)) return { error: "Invalid SKU" } as const;
  if (!Number.isInteger(slot) || slot < 1 || slot > 20) {
    return { error: "Image slot must be between 1 and 20" } as const;
  }

  return { brand, sku, slot } as const;
}

export async function POST(request: Request) {
  try {
    console.log('[product-images] POST handler invoked', { url: request.url });
    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    const params = parseImageParams(request);
    console.log('[product-images] parsed params', params);
    if ("error" in params && params.error) return badRequest(params.error);

    const formData = await request.formData();
    console.log('[product-images] formData received');
    const file = formData.get("file");

    // Accept File/Blob-like objects: check for arrayBuffer() method instead of `instanceof`
    if (!file || typeof (file as any).arrayBuffer !== "function") return badRequest("A WebP file is required");
    const type = (file as any).type ?? "";
    const name = (file as any).name ?? "";
    const size = (file as any).size ?? 0;

    if (type !== "image/webp" && !name.toLowerCase().endsWith(".webp")) {
      return badRequest("Only WebP images are supported");
    }
    if (size > 12 * 1024 * 1024) {
      return badRequest("Images must be 12 MB or smaller");
    }

    const path = productImagePath(params.brand, params.sku, params.slot);
    const arrayBuffer = await (file as Blob).arrayBuffer();
    const result = await getProductStorage().storage.from(PRODUCT_BUCKET).upload(
      path,
      Buffer.from(arrayBuffer),
      { contentType: "image/webp", upsert: true },
    );

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    return NextResponse.json({ path, replaced: result.data?.path === path });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const params = parseImageParams(request);
  if ("error" in params && params.error) return badRequest(params.error);

  const path = productImagePath(params.brand, params.sku, params.slot);
  const result = await getProductStorage().storage.from(PRODUCT_BUCKET).remove([path]);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  try {
    const token = await getKeystaticGitHubAccessToken(request);
    if (!token) throw new Error("Keystatic session expired");
    const current = await readCloudProduct(token, params.brand, params.sku);
    const currentCount = Number(current?.product.imageCount ?? 1);
    if (currentCount <= 1) throw new Error("A product must keep at least one image slot");
    await updateCloudProductImageCount(token, params.brand, params.sku, currentCount - 1);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image count update failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ path, imageCountUpdated: true });
}
