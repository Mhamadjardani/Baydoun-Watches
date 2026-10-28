"use client";

import WatchCard from "@/components/showroom/WatchCard";
import { BRAND_LABELS, finalPrice, formatPrice } from "@/lib/showcase";
import type { ProductCard, ProductDetails } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Heart, Share2, ShieldCheck, ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WatchImage from "@/components/showroom/WatchImage";
import { useSwipe } from "@/components/motion/useSwipe";

// The same 3D pedestal as the homepage spotlight; three.js loads in the browser only.
const StageScene = dynamic(() => import("@/components/home/StageScene"), { ssr: false });

const ease = [0.2, 0.9, 0.1, 1] as const;

const ProductDetails = ({
  product,
  products,
}: {
  product: ProductDetails;
  products: ProductCard[];
}) => {
  const fallbackImage = "/baydoun-logo.webp";
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const cartItems = useCommerceStore((state) => state.cartItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const stageRef = useRef<HTMLDivElement>(null);

  const images = product.images.length ? product.images : [fallbackImage];
  const activeImage = images[activeIndex] ?? fallbackImage;
  const activeDisplayImage = failedImages.has(activeImage) ? fallbackImage : activeImage;
  const brandLabel = BRAND_LABELS[product.brand] ?? product.brand;

  // Swipe (or drag) the stage to the next/previous photo, skipping missing ones.
  const { style: swipeStyle, ...swipe } = useSwipe((step) => {
    const shown = images.map((_, i) => i).filter((i) => !failedImages.has(images[i]));
    if (shown.length < 2) return;
    const at = Math.max(0, shown.indexOf(activeIndex));
    setActiveIndex(shown[(at + step + shown.length) % shown.length]);
  });
  const sale = (product.discount ?? 0) > 0;
  const isWishlisted =
    hasHydrated &&
    wishlistItems.some((item) => item.productSlug === product.slug && item.productBrand === product.brand);
  // "You may also like": same brand, only watches that can be ordered.
  const relatedProducts = products.filter(
    (prod) => prod.brand == product.brand && !prod.isOutOfStock && prod.slug !== product.slug,
  );
  const cartQuantity = cartItems.find((item) => item.productSlug === product.slug)?.quantity ?? 0;
  const inBag = hasHydrated && cartQuantity > 0 && !product.isOutOfStock;

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} by ${brandLabel} at Baydoun Watches.`,
      url: window.location.href,
    };

    const copyProductUrl = async () => {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareData.url);
          return;
        } catch {
          // Fall through to the legacy copy method for restricted contexts.
        }
      }

      const input = document.createElement("textarea");
      input.value = shareData.url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();

      const copied = document.execCommand("copy");
      input.remove();

      if (!copied) {
        throw new Error("Copy failed");
      }
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyProductUrl();
      toast.success("Product link copied");
    } catch {
      toast.error("Unable to share this product");
    }
  };

  const markImageFailed = (image: string) => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(image);
      return next;
    });
  };

  // "More from this brand" drifts on its own and pauses under the pointer.
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame: number;
    const step = () => {
      if (!pausedRef.current) container.scrollLeft += 0.5;
      // seamless reset (half because the list is duplicated)
      if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  // The watch leans toward the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-12, 12]), { stiffness: 80, damping: 14 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [9, -9]), { stiffness: 80, damping: 14 });

  const details = [
    { label: "Brand", value: brandLabel },
    { label: "For", value: product.gender },
    { label: "Display", value: product.display },
    { label: "Reference", value: product.sku },
  ].filter((d) => d.value);

  return (
    <main
      className="min-h-screen bg-paper pb-24 pt-24 text-ink"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        px.set((e.clientX / window.innerWidth) * 2 - 1);
        py.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:px-16">
        {/* ── The stage ─────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-7rem)]">
          <div
            ref={stageRef}
            className="relative h-[56svh] min-h-[360px] lg:h-[calc(100%-6rem)]"
            {...swipe}
            style={{ ...swipeStyle, ["--plinth-y" as string]: "70%" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_34%_60%_at_50%_42%,rgba(212,171,98,0.22),rgba(255,255,255,0)_70%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-[75%] w-[46%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(212,171,98,0.16),rgba(212,171,98,0))] [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]"
            />

            <StageScene stageRef={stageRef} pulse={activeIndex} />

            {/* The watch sits above the light and the 3D stage, in its true colours. */}
            <div className="absolute inset-x-0 top-0 z-10" style={{ height: "var(--plinth-y)", perspective: 1100 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeDisplayImage}
                  className="absolute bottom-0 left-1/2 h-[80%] w-[min(82%,500px)] -translate-x-1/2"
                  initial={{ opacity: 0, rotateY: 70, filter: "blur(8px)" }}
                  animate={{ opacity: 1, rotateY: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, rotateY: -70, filter: "blur(8px)" }}
                  transition={{ duration: 0.8, ease }}
                >
                  <motion.div className="h-full w-full" style={{ rotateX, rotateY }}>
                    <motion.div
                      className="h-full w-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <WatchImage
                        src={activeDisplayImage}
                        alt={product.title}
                        loading="eager"
                        whileLoading="hide"
                        onMissing={() => markImageFailed(activeImage)}
                        className={`h-full w-full object-contain object-bottom ${
                          product.isOutOfStock ? "opacity-60 grayscale" : ""
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex justify-center gap-3">
              {images.map((image, index) =>
                // A listed photo that doesn't exist in storage is left out rather than shown broken.
                failedImages.has(image) ? null : (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View image ${index + 1} of ${product.title}`}
                  aria-pressed={index === activeIndex}
                  className={`relative h-18 w-18 cursor-pointer overflow-hidden rounded-full bg-[#f6f5f1] transition-all duration-300 ${
                    index === activeIndex ? "ring-1 ring-gold ring-offset-4" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <WatchImage
                    src={image}
                    alt=""
                    onMissing={() => markImageFailed(image)}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* ── Details ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 pt-2 font-jost lg:pt-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="flex flex-wrap items-center gap-3">
              <Link href={`/collections?brand=${product.brand}`} className="text-xs tracking-[0.3em] text-gold-deep hover:text-ink">
                {brandLabel.toUpperCase()}
              </Link>
              {product.isNewArrival && <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] tracking-[0.12em] text-gold-deep">New</span>}
              {product.isLimitedEdition && <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] tracking-[0.12em] text-gold-deep">Limited</span>}
            </motion.div>
            <h1 className="mt-4 overflow-hidden font-serif text-3xl font-light leading-[1.05] sm:text-5xl">
              <motion.span className="block" initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, delay: 0.1, ease }}>
                {product.title}
              </motion.span>
            </h1>
            {product.description && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="mt-6 max-w-xl leading-relaxed text-ink/65">
                {product.description}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="flex flex-wrap items-end justify-between gap-4 border-y border-gold/25 py-6"
          >
            <p className="flex items-baseline gap-3">
              <span className="font-serif text-5xl">{formatPrice(finalPrice(product))}</span>
              {sale && (
                <>
                  <span className="text-lg text-ink/40 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-gold px-3 py-1 text-xs text-ink">-{product.discount}%</span>
                </>
              )}
            </p>
            {product.isOutOfStock ? (
              <span className="text-sm text-ink/60">Out of stock for now</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-ink/70">
                <ShieldCheck size={18} className="text-gold-deep" />
                In stock, authentic, delivered across Lebanon
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              disabled={product.isOutOfStock}
              onClick={() => {
                if (product.isOutOfStock) return;
                addToCart(product.brand, product.slug);
                toast.success(`${product.title} added to your bag`);
              }}
              aria-label={
                product.isOutOfStock
                  ? "Out of stock"
                  : inBag
                    ? `In your bag (${cartQuantity}). Add another ${product.title}`
                    : `Add ${product.title} to bag`
              }
              // Same pill as Save and Share; it fills gold once the watch is in the bag, like Saved.
              className={`flex h-14 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 text-sm tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                inBag ? "border-gold bg-gold text-ink" : "border-ink/20 enabled:hover:border-gold"
              }`}
            >
              <ShoppingBag size={18} />
              {product.isOutOfStock ? "Out of stock" : inBag ? `In your bag (${cartQuantity})` : "Add to bag"}
            </button>
            <button
              type="button"
              aria-pressed={isWishlisted}
              onClick={() => {
                toggleWishlist(product.brand, product.slug);
                toast.success(`${product.title} ${isWishlisted ? "removed from" : "added to"} wishlist`);
              }}
              className={`flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border px-6 text-sm tracking-[0.14em] transition-colors ${
                isWishlisted ? "border-gold bg-gold text-ink" : "border-ink/20 hover:border-gold"
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => void handleShare()}
              className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/20 px-6 text-sm tracking-[0.14em] transition-colors hover:border-gold"
            >
              <Share2 size={18} />
              Share
            </button>
          </motion.div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-gold/25 bg-gold/25">
            {details.map((detail) => (
              <div key={detail.label} className="bg-paper px-5 py-4">
                <dt className="text-[11px] tracking-[0.2em] text-ink/45">{detail.label.toUpperCase()}</dt>
                <dd className="mt-1 text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>

          {product.features.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl font-light">Features</h2>
              <ul className="mt-4 grid gap-3">
                {product.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex items-start gap-3 leading-relaxed text-ink/75"
                  >
                    <Check size={18} className="mt-1 shrink-0 text-gold-deep" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </section>
          )}

          {product.specifications.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl font-light">Specifications</h2>
              <dl className="mt-4 divide-y divide-gold/20 border-y border-gold/20">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[minmax(120px,0.8fr)_1fr] gap-4 py-3 text-sm">
                    <dt className="text-ink/50">{spec.label}</dt>
                    <dd className="text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1500px] px-6 sm:px-10 xl:px-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/25 pb-6">
            <h2 className="font-serif text-4xl font-light sm:text-5xl">More from {brandLabel}</h2>
            <Link href={`/collections?brand=${product.brand}`} className="group inline-flex items-center gap-3 font-jost text-sm tracking-[0.14em]">
              View all
              <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
            </Link>
          </div>
          <div
            ref={scrollRef}
            className="no-scrollbar mt-10 flex gap-6 overflow-x-auto pb-2"
            style={{ scrollBehavior: "auto" }}
            onPointerEnter={() => (pausedRef.current = true)}
            onPointerLeave={() => (pausedRef.current = false)}
          >
            {[...relatedProducts, ...relatedProducts].map((related, index) => (
              <div key={`${related.slug}-${index}`} className="w-56 shrink-0 sm:w-64">
                <WatchCard product={related} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
