// Site-wide launch offer. While it runs, every watch shows exactly this discount
// and any discount saved on the product is ignored. Set `percent` to 0 to end
// the offer and bring the saved discounts back (pages are prerendered, so it
// takes effect on the next deploy).
// Only the storefront applies it; admin and Keystatic keep the real values.
export const LAUNCH_PROMO = {
  percent: 15,
  label: "Launch offer",
};

export const launchPromoActive = LAUNCH_PROMO.percent > 0;

export function withLaunchPromo<T extends { discount: number | null }>(product: T): T {
  if (!launchPromoActive) return product;
  return { ...product, discount: LAUNCH_PROMO.percent };
}
