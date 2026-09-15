import { NextResponse } from "next/server";

import { getKeystaticGitHubAccessToken, getKeystaticGitHubUser } from "../../../../lib/adminAuth";
import { readGitHubProduct } from "../../../../lib/githubContent";

export const runtime = "nodejs";

export async function GET(request: Request) {
  // Still gates on "is someone actually logged in" via either storage mode's
  // token - unrelated to the GITHUB_ADMIN_PAT used below, which is a
  // separate, server-only credential for the actual repo access.
  const token = await getKeystaticGitHubAccessToken(request);
  const user = await getKeystaticGitHubUser(request);
  if (!token || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const brand = url.searchParams.get("brand") ?? "";
  const sku = url.searchParams.get("sku") ?? "";
  if (!/^[a-zA-Z0-9_-]+$/.test(sku)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  try {
    const result = await readGitHubProduct(brand, sku);
    if (!result) return NextResponse.json({ error: "Product not found in GitHub" }, { status: 404 });

    return NextResponse.json({
      slug: sku,
      brand,
      ...result.product,
      image: `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${brand}/${sku}/1.webp`,
    });
  } catch (error) {
    console.error("GitHub product sync failed", { brand, sku, error });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GitHub product sync failed" },
      { status: 502 },
    );
  }
}
