import CasioLines, { type CasioLine } from "@/components/home/CasioLines";
import BrandMarquee from "@/components/home/BrandMarquee";
import ForWhom from "@/components/home/ForWhom";
import HelpChoose from "@/components/home/HelpChoose";
import HeroSpotlight from "@/components/home/HeroSpotlight";
import HeritageArch from "@/components/home/HeritageArch";
import Promises from "@/components/home/Promises";
import { ShowcasePool } from "@/components/home/ShowcasePool";
import SpotlightTrack from "@/components/home/SpotlightTrack";
import { getAllProducts } from "@/lib/products";
import { pickAcrossBrands, toShowcase } from "@/lib/showcase";
import { formatSubCategory, normalizeSubCategory, type ProductCard } from "@/lib/type";

/** Size of the shared pool; each visit shuffles it and every section takes its own slice. */
const POOL_SIZE = 120;

const CASIO_LINE_NAMES: Record<string, string> = {
  "g-shock": "G-Shock",
  "baby-g": "Baby-G",
  general: "Classic Casio",
};

/** One door per Casio line, largest first, with the catch-all "general" last. */
function casioLines(products: ProductCard[]): CasioLine[] {
  const groups = new Map<string, ProductCard[]>();
  for (const p of products) {
    if (p.brand !== "casio") continue;
    const key = normalizeSubCategory(p.subCategory, p.brand);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups.entries()]
    .sort((a, b) => Number(a[0] === "general") - Number(b[0] === "general") || b[1].length - a[1].length)
    .map(([key, list]) => {
      const inStock = pickAcrossBrands(list, 10);
      const options = (inStock.length ? inStock : list.slice(0, 1)).map((p) => ({ image: p.image, title: p.title }));
      return { key, name: CASIO_LINE_NAMES[key] ?? formatSubCategory(key), count: list.length, options };
    });
}

export default async function Home() {
  // Everything below comes from the live catalogue at build time; a watch removed
  // in Keystatic drops out on the next deploy. Hidden and out-of-stock pieces never appear.
  const products = await getAllProducts();
  // Wristwatches only: wall clocks stay in the catalogue but not in the showroom.
  const pool = pickAcrossBrands(
    products,
    POOL_SIZE,
    (p) => normalizeSubCategory(p.subCategory, p.brand) !== "wall-clock",
  ).map(toShowcase);

  const counts: Partial<Record<ProductCard["brand"], number>> = {};
  for (const p of products) counts[p.brand] = (counts[p.brand] ?? 0) + 1;

  return (
    <ShowcasePool pool={pool}>
      <div className="bg-paper">
        <HeroSpotlight />
        <BrandMarquee />
        <SpotlightTrack />
        <ForWhom />
        <CasioLines lines={casioLines(products)} total={counts.casio ?? 0} />
        <Promises />
        <HeritageArch />
        <HelpChoose />
      </div>
    </ShowcasePool>
  );
}
