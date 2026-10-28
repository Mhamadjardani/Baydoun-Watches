// Rendered inside client components only (collection, search, sales, wishlist,
// product page), so it takes callback props without a "use client" entry.
import { BRAND_LABELS, finalPrice, formatPrice } from "@/lib/showcase";
import type { ProductCard } from "@/lib/type";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FALLBACK_IMAGE = "/baydoun-logo.webp";

/**
 * One watch in the showroom: a soft lacquer tile where the photo floats (its
 * white background multiplies away). Hover brings a gold pool of light and a
 * floor ring, like the homepage spotlight.
 */
export default function WatchCard({
  product,
  wishlisted,
  onToggleWishlist,
  removeMode = false,
}: {
  product: ProductCard;
  wishlisted?: boolean;
  onToggleWishlist?: () => void;
  /** Wishlist page: the button removes instead of toggling a heart. */
  removeMode?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const sale = (product.discount ?? 0) > 0;
  const href = `/collections/${product.brand}/${product.slug}`;
  const badge = product.isOutOfStock
    ? "Out of stock"
    : sale
      ? `-${product.discount}%`
      : product.isNewArrival
        ? "New"
        : product.isLimitedEdition
          ? "Limited"
          : null;

  return (
    <article className="group relative">
      {onToggleWishlist && (
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-pressed={removeMode ? undefined : wishlisted}
          aria-label={
            removeMode
              ? `Remove ${product.title} from wishlist`
              : `${wishlisted ? "Remove" : "Save"} ${product.title} ${wishlisted ? "from" : "to"} wishlist`
          }
          className={`absolute right-3 top-3 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full border transition-all duration-300 active:scale-90 ${
            wishlisted && !removeMode
              ? "border-gold bg-gold text-ink"
              : "border-ink/10 bg-paper/90 text-ink/70 hover:border-gold hover:text-gold-deep"
          }`}
        >
          {removeMode ? <X size={16} /> : <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />}
        </button>
      )}

      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#f6f5f1]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_50%_58%,rgba(212,171,98,0.42),rgba(246,245,241,0)_72%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-[18%] bottom-[7%] h-6 scale-75 rounded-[50%] border border-gold opacity-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:scale-100 group-hover:opacity-100"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={failed ? FALLBACK_IMAGE : product.image}
            alt={product.title}
            loading="lazy"
            onError={() => setFailed(true)}
            // Server-rendered images can fail before React listens; catch those on mount.
            ref={(el) => {
              if (!failed && el?.complete && el.naturalWidth === 0) setFailed(true);
            }}
            className={`absolute inset-0 h-full w-full object-contain p-5 mix-blend-multiply brightness-[1.04] contrast-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:-translate-y-2 group-hover:scale-[1.06] ${
              product.isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />
          {badge && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 font-jost text-[11px] tracking-[0.12em] ${
                product.isOutOfStock ? "bg-ink text-paper" : "border border-gold/40 bg-paper text-gold-deep"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="px-1 pt-4 font-jost">
          <p className="text-[11px] tracking-[0.18em] text-gold-deep">{(BRAND_LABELS[product.brand] ?? product.brand).toUpperCase()}</p>
          <h3 className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink/80 transition-colors group-hover:text-ink">{product.title}</h3>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl text-ink">{formatPrice(finalPrice(product))}</span>
            {sale && <span className="text-xs text-ink/40 line-through">{formatPrice(product.price)}</span>}
          </p>
          <span className="mt-3 block h-px w-0 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}
