import { NextResponse } from "next/server";

import { getKeystaticGitHubAccessToken, getKeystaticGitHubUser } from "../../../../lib/adminAuth";
import { readCloudProduct } from "../../../../lib/keystaticCloud";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = await getKeystaticGitHubAccessToken(request);
  const user = await getKeystaticGitHubUser(request);
  if (!token || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const brand = url.searchParams.get("brand") ?? "";
  const sku = url.searchParams.get("sku") ?? "";
  if (!/^[a-zA-Z0-9_-]+$/.test(sku)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const result = await readCloudProduct(token, brand, sku);
  if (!result) return NextResponse.json({ error: "Product not found in Keystatic Cloud" }, { status: 404 });

  return NextResponse.json({
    slug: sku,
    brand,
    ...result.product,
    image: `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${brand}/${sku}/1.webp`,
  });
}
