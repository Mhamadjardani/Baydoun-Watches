import type { ProductCard } from "./type";

/** The small slice of a product the homepage animations need. */
export type ShowcaseWatch = {
  image: string;
  title: string;
  brand: ProductCard["brand"];
  price: number;
  originalPrice: number | null;
  href: string;
  /** Round analog face: needed by the piece-by-piece assembly. */
  analog: boolean;
  /** Short label for the corner of a tile: "-20%", "New" or "Limited". */
  badge: string | null;
};

export const BRAND_LABELS: Record<ProductCard["brand"], string> = {
  calvinKlein: "Calvin Klein",
  casio: "Casio",
  lacoste: "Lacoste",
  omorfia: "Omorfia",
  rovina: "Rovina",
  tommyHilfiger: "Tommy Hilfiger",
};

export const finalPrice = (p: Pick<ProductCard, "price" | "discount">) =>
  p.discount && p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

export const toShowcase = (p: ProductCard): ShowcaseWatch => ({
  image: p.image,
  title: p.title,
  brand: p.brand,
  price: finalPrice(p),
  originalPrice: p.discount && p.discount > 0 ? p.price : null,
  href: `/collections/${p.brand}/${p.slug}`,
  analog: p.display === "Analog",
  badge:
    p.discount && p.discount > 0
      ? `-${p.discount}%`
      : p.isNewArrival
        ? "New"
        : p.isLimitedEdition
          ? "Limited"
          : null,
});

const showcaseScore = (p: ProductCard) =>
  Number(p.isFeatured) * 2 + Number(p.isNewArrival) * 2 + Number(p.isLimitedEdition);

/**
 * In-stock pieces ranked featured/new first, then newest, taken one brand at a
 * time so a short list still shows the whole house. Deterministic, so server
 * and client render the same list.
 */
export function pickAcrossBrands(
  products: ProductCard[],
  count: number,
  filter: (p: ProductCard) => boolean = () => true,
) {
  const byBrand = new Map<string, ProductCard[]>();
  for (const p of products) {
    if (p.isOutOfStock || !filter(p)) continue;
    byBrand.set(p.brand, [...(byBrand.get(p.brand) ?? []), p]);
  }
  const lists = [...byBrand.values()].map((list) =>
    list.sort(
      (a, b) =>
        showcaseScore(b) - showcaseScore(a) ||
        (b.createdAt ?? "").localeCompare(a.createdAt ?? "") ||
        a.slug.localeCompare(b.slug),
    ),
  );
  const picked: ProductCard[] = [];
  for (let round = 0; picked.length < count && lists.some((l) => l[round]); round++) {
    for (const list of lists) if (list[round] && picked.length < count) picked.push(list[round]);
  }
  return picked;
}
