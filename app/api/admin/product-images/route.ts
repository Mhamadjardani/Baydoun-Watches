import { NextResponse } from "next/server";

import { getAdminUser } from "../../../../lib/adminAuth";
import {
  PRODUCT_BRANDS,
  PRODUCT_BUCKET,
  isSafeProductPathPart,
  productImagePath,
  getProductStorage,
} from "../../../../lib/productAdmin";
import {
  GitHubRateLimitError,
  readGitHubProduct,
  updateGitHubProductImageCount,
} from "../../../../lib/githubContent";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function requireAdmin(request: Request) {
  const user = await getAdminUser(request);
  if (!user) {
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

    if (!file || typeof file === "string") return badRequest("An image file is required");
    const { type, name, size } = file;

    if (!type.startsWith("image/") && !name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/i)) {
      return badRequest("Only image files are supported");
    }
    if (size > 12 * 1024 * 1024) {
      return badRequest("Images must be 12 MB or smaller");
    }

    const path = productImagePath(params.brand, params.sku, params.slot);
    const arrayBuffer = await file.arrayBuffer();
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

  try {
    // Validate against GitHub before touching storage, so a rejected delete
    // never leaves an image removed with a stale Image Count.
    const current = await readGitHubProduct(params.brand, params.sku);
    if (!current) return NextResponse.json({ error: "Product not found in GitHub" }, { status: 404 });
    const currentCount = Number(current.product.imageCount ?? 1);
    if (currentCount <= 1) return badRequest("A product must keep at least one image slot");
    if (params.slot !== currentCount) return badRequest(`Only the last image (${currentCount}.webp) can be deleted`);

    const path = productImagePath(params.brand, params.sku, params.slot);
    const result = await getProductStorage().storage.from(PRODUCT_BUCKET).remove([path]);
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    await updateGitHubProductImageCount(params.brand, params.sku, currentCount - 1, current);
    return NextResponse.json({ path, imageCount: currentCount - 1 });
  } catch (error) {
    if (error instanceof GitHubRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfter: error.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image count update failed" },
      { status: 502 },
    );
  }
}
