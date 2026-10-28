"use client";

import { inStockFirst } from "@/components/OutOfStockBadge";
import PageHeader from "@/components/showroom/PageHeader";
import WatchCard from "@/components/showroom/WatchCard";
import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import toast from "react-hot-toast";

const SalesPage = ({ products }: { products: ProductCard[] }) => {
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  // Biggest savings first, sold-out pieces last.
  const salesProducts = useMemo(
    () =>
      products
        .filter((p) => p.discount && p.discount > 0)
        .sort((a, b) => inStockFirst(a, b) || (b.discount ?? 0) - (a.discount ?? 0)),
    [products],
  );
  const bestSaving = salesProducts.reduce((max, p) => Math.max(max, p.discount ?? 0), 0);

  return (
    <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="The sale"
          title={["Beautiful watches,", "lighter prices"]}
          caption="Selected pieces at special prices, while stock lasts."
          aside={
            bestSaving > 0 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.5 }}
                className="grid h-32 w-32 place-items-center rounded-full border border-gold bg-[#f6f5f1] text-center"
              >
                <span className="font-jost text-[10px] tracking-[0.3em] text-gold-deep">UP TO</span>
                <span className="-mt-3 font-serif text-5xl font-light">-{bestSaving}%</span>
              </motion.div>
            ) : undefined
          }
        />

        {salesProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-4xl font-light">No watches on sale right now.</p>
            <p className="mx-auto mt-4 max-w-md font-jost text-ink/60">Check back soon, or explore the full collection.</p>
            <Link
              href="/collections"
              className="group relative mt-8 inline-flex overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors group-hover:text-ink">Browse the collection</span>
            </Link>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {salesProducts.map((product, index) => {
              const wishlisted =
                hasHydrated &&
                wishlistItems.some((item) => item.productSlug === product.slug && item.productBrand === product.brand);
              return (
                <motion.li
                  key={`${product.brand}-${product.slug}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.2, 0.9, 0.1, 1] }}
                >
                  <WatchCard
                    product={product}
                    wishlisted={wishlisted}
                    onToggleWishlist={() => {
                      toggleWishlist(product.brand, product.slug);
                      toast.success(`${product.title} ${wishlisted ? "removed from" : "added to"} wishlist`);
                    }}
                  />
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SalesPage;
