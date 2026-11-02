import { getShopProducts } from "@/lib/products";

// The full catalogue as one static file, built at deploy time and served from the
// CDN. The navbar and search load it in the browser, so it is not embedded in the
// HTML of every page (that made each page over 1 MB and used up Vercel's Fast
// Origin Transfer allowance).
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getShopProducts());
}
