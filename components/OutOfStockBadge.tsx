import type { ProductCard } from "@/lib/type";

/** Pill shown on product cards when the editor ticked "Out of stock". */
export default function OutOfStockBadge({
  variant = "pill",
}: {
  /** "pill" matches the collection grid, "tag" the sales/search/wishlist cards. */
  variant?: "pill" | "tag";
}) {
  const className =
    variant === "pill"
      ? "rounded-full bg-neutral-900/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur"
      : "inline-block border border-white/25 bg-neutral/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur";

  return <span className={className}>Out of stock</span>;
}

/** Dims a card image for out-of-stock products. */
export const outOfStockImageClass = (
  product: Pick<ProductCard, "isOutOfStock">,
) => (product.isOutOfStock ? "opacity-50 grayscale" : "");

/** Sort comparator: in-stock products before out-of-stock ones. */
export const inStockFirst = (
  first: Pick<ProductCard, "isOutOfStock">,
  second: Pick<ProductCard, "isOutOfStock">,
) => Number(first.isOutOfStock) - Number(second.isOutOfStock);
