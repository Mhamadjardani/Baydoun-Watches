// Site-wide launch offer. While it runs, every watch shows exactly this discount
// and any discount saved on the product is ignored. Set `percent` to 0 to end
// the offer and bring the saved discounts back (pages are prerendered, so it
// takes effect on the next deploy).
// Only the storefront applies it; admin and Keystatic keep the real values.
// Off since 2026-11-11: the 15% now lives in each product's own "Discount %"
// field, so it can be removed per watch in Keystatic.
export const LAUNCH_PROMO = {
  percent: 0,
  label: "Launch offer",
};

export const launchPromoActive = LAUNCH_PROMO.percent > 0;

/** Share of watches on discount from which the hero badge says "almost every watch". */
const ALMOST_ALL = 0.8;

/**
 * Wording for the hero's offer badge, worked out from the products' own
 * discounts at build time, so it stays true as discounts are edited in
 * Keystatic. Null when nothing is discounted (the badge is hidden).
 */
export function describeOffer(products: { discount: number | null; isOutOfStock: boolean }[]) {
  const inStock = products.filter((p) => !p.isOutOfStock);
  const discounts = inStock.map((p) => p.discount ?? 0).filter((d) => d > 0);
  if (!inStock.length || !discounts.length) return null;

  const best = Math.max(...discounts);
  const sameEverywhere = discounts.every((d) => d === best);
  const share = discounts.length / inStock.length;
  const reach =
    share === 1 ? "ON EVERY WATCH" : share >= ALMOST_ALL ? "ON ALMOST EVERY WATCH" : "ON SELECTED WATCHES";

  return {
    badge: sameEverywhere ? `-${best}%` : `UP TO -${best}%`,
    text: `${LAUNCH_PROMO.label.toUpperCase()} · ${reach}`,
  };
}

export type OfferBadge = NonNullable<ReturnType<typeof describeOffer>>;

export function withLaunchPromo<T extends { discount: number | null }>(product: T): T {
  if (!launchPromoActive) return product;
  return { ...product, discount: LAUNCH_PROMO.percent };
}
