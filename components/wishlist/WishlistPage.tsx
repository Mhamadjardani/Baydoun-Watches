"use client";

import PageHeader from "@/components/showroom/PageHeader";
import WatchCard from "@/components/showroom/WatchCard";
import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import toast from "react-hot-toast";

const ease = [0.2, 0.9, 0.1, 1] as const;

const WishlistPage = ({ products }: { products: ProductCard[] }) => {
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const removeFromWishlist = useCommerceStore(
    (state) => state.removeFromWishlist,
  );

  const wishlistProducts = useMemo(
    () =>
      wishlistItems
        .map((item) =>
          products.find(
            (product) =>
              product.slug === item.productSlug &&
              product.brand === item.productBrand,
          ),
        )
        .filter((product): product is ProductCard => Boolean(product)),
    [wishlistItems, products],
  );

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
        <div className="mx-auto max-w-[1500px] py-24 text-center">
          <p className="font-serif text-2xl font-light text-ink/60">
            Preparing your wishlist…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Saved for later"
          title={["Your wishlist"]}
          caption="The watches you have your eye on, kept in one place. Compare them at your own pace and add a favourite to your bag when you are ready."
          aside={
            wishlistProducts.length > 0 ? (
              <p className="font-jost text-sm text-ink/60">
                <span className="font-serif text-3xl text-ink">
                  {wishlistProducts.length}
                </span>{" "}
                {wishlistProducts.length === 1 ? "watch" : "watches"} saved
              </p>
            ) : undefined
          }
        />

        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="flex flex-col items-center px-2 py-24 text-center"
          >
            <p className="max-w-xl font-serif text-3xl font-light leading-snug sm:text-4xl">
              Nothing saved yet.
            </p>
            <p className="mt-4 max-w-md font-jost text-base leading-relaxed text-ink/60">
              Tap the heart on any watch in the collection and it will be kept
              here for you.
            </p>
            <Link
              href="/collections"
              className="group relative mt-10 overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors group-hover:text-ink">
                Browse the collection
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            <AnimatePresence>
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={`${product.brand}:${product.slug}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
                  transition={{
                    duration: 0.8,
                    delay: (index % 4) * 0.08,
                    ease,
                  }}
                >
                  <WatchCard
                    product={product}
                    wishlisted
                    removeMode
                    onToggleWishlist={() => {
                      removeFromWishlist(product.brand, product.slug);
                      toast.success(`${product.title} removed from wishlist`, {
                        icon: "❤️",
                      });
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
