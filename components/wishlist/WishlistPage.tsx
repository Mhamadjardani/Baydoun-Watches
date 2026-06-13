"use client";

import { Product } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { ArrowRight, Heart, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const WishlistPage = ({ products }: { products: Product[] }) => {
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const removeFromWishlist = useCommerceStore(
    (state) => state.removeFromWishlist,
  );
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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
        .filter((product): product is Product => Boolean(product)),
    [wishlistItems, products],
  );

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const getImage = (product: Product) =>
    failedImages.has(product.images[0]) ? "/test.png" : product.images[0];

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
        <section className="mx-auto max-w-screen-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-widest text-secondary">
            Preparing your wishlist
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Saved selection
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                Wishlist
              </h1>
              <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
                Keep your preferred timepieces close, compare them at your pace,
                and move favourites into your shopping bag when ready.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-4 py-3 text-xs uppercase tracking-widest text-primary">
              <Heart size={16} fill="currentColor" />
              {wishlistProducts.length} saved
            </div>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="border border-white/10 bg-white/3 px-6 py-20 text-center">
            <p className="text-2xl font-bold uppercase tracking-widest text-white font-playfair">
              No saved watches yet
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 tracking-wide text-secondary">
              Tap the heart on a collection item and it will appear here after
              refresh or navigation.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center justify-center gap-3 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-neutral transition hover:bg-secondary"
            >
              Browse collections
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistProducts.map((product, index) => (
              <article
                key={product.slug + index}
                className="group relative overflow-hidden border border-primary/10 bg-light-neutral shadow-[0_30px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
              >
                <button
                  type="button"
                  aria-label={`Remove ${product.title} from wishlist`}
                  onClick={() =>
                    removeFromWishlist(product.brand, product.slug)
                  }
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-neutral/70 text-secondary backdrop-blur transition hover:border-primary/50 hover:text-primary"
                >
                  <X size={18} />
                </button>

                <Link
                  href={`/collections/${product.brand}/${product.slug}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-neutral">
                    <Image
                      src={getImage(product)}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      onError={() => markImageFailed(product.images[0])}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 border border-primary/30 bg-neutral/70 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
                      Saved
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <p className="w-fit bg-primary/10 px-2 py-1 text-xs uppercase tracking-widest text-primary">
                        {product.brand}
                      </p>
                      <h2 className="min-h-14 text-lg font-bold uppercase leading-7 tracking-widest text-white font-playfair">
                        {product.title}
                      </h2>
                      <p className="line-clamp-2 text-sm leading-6 text-secondary">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <p className="text-lg font-bold tracking-wide text-primary">
                        {formatPrice(product.price)}
                      </p>
                      <span className="text-xs uppercase tracking-widest text-secondary/70">
                        Details
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product.brand, product.slug);
                      toast.success(`${product.title} added to bag`, {
                        icon: "🛍️",
                      });
                    }}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-3 border border-primary/30 bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary transition hover:border-primary/60 hover:bg-primary hover:text-neutral"
                  >
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default WishlistPage;
