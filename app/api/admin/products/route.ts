import { NextResponse } from "next/server";

import { getAdminUser } from "../../../../lib/adminAuth";
import { GitHubRateLimitError, MAX_BATCH_SIZE, readGitHubProducts } from "../../../../lib/githubContent";
import { PRODUCT_BRANDS, isSafeProductPathPart } from "../../../../lib/productAdmin";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "private, no-store" };

/**
 * GET /api/admin/products?items=brand:sku,brand:sku,...
 * Returns the latest GitHub copy of each requested product in one call.
 */
export async function GET(request: Request) {
  const user = await getAdminUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });

  const items = (new URL(request.url).searchParams.get("items") ?? "").split(",").filter(Boolean);
  if (items.length === 0 || items.length > MAX_BATCH_SIZE) {
    return NextResponse.json({ error: `Request between 1 and ${MAX_BATCH_SIZE} products` }, { status: 400, headers: noStore });
  }

  const refs = [];
  for (const item of items) {
    const [brand, sku] = item.split(":");
    if (!PRODUCT_BRANDS.has(brand) || !sku || !isSafeProductPathPart(sku)) {
      return NextResponse.json({ error: `Invalid product: ${item}` }, { status: 400, headers: noStore });
    }
    refs.push({ brand, sku });
  }

  try {
    const latest = await readGitHubProducts(refs);
    const products = refs.flatMap(({ brand, sku }) => {
      const product = latest.get(`${brand}/${sku}`);
      if (!product) return [];
      return [{
        ...product,
        slug: sku,
        brand,
        image: `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${brand}/${sku}/1.webp`,
      }];
    });
    return NextResponse.json({ products }, { headers: noStore });
  } catch (error) {
    if (error instanceof GitHubRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfter: error.retryAfterSeconds },
        { status: 429, headers: { ...noStore, "Retry-After": String(error.retryAfterSeconds) } },
      );
    }
    console.error("GitHub product sync failed", { count: refs.length, error });
    return NextResponse.json({ error: "GitHub product sync failed" }, { status: 502, headers: noStore });
  }
}
