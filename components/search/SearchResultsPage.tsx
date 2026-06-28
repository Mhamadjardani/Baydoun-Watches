"use client";

import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (price: ProductCard["price"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const matchesSearch = (product: ProductCard, query: string) => {
  const searchable = [
    product.title,
    product.brand,
    // product.category,
    product.subCategory,
    product.sku,
    product.display,
    product.gender,
    product.description,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const SearchResultsPage = ({ products }: { products: ProductCard[] }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const normalizedQuery = query.trim().toLowerCase();
  const pageSize = 12;

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return products
      .filter((product) => matchesSearch(product, normalizedQuery))
      .sort((firstProduct, secondProduct) =>
        firstProduct.title.localeCompare(secondProduct.title),
      );
  }, [normalizedQuery, products]);

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const getPagination = () => {
    const delta = 1;
    const range: (number | "...")[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) range.unshift("...");
    if (page + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const pageProducts = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-screen bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Search results
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                {query ? query : "Search"}
              </p>
              <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
                Browse every matching timepiece from the collection, then open
                any watch for full details.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-4 py-3 text-xs uppercase tracking-widest text-primary">
              <Search size={16} />
              {results.length} results
            </div>
          </div>
        </div>

        {!normalizedQuery ? (
          <div className="border border-white/10 bg-white/3 px-6 py-20 text-center">
            <p className="text-2xl font-bold uppercase tracking-widest text-white font-playfair">
              Start a search
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 tracking-wide text-secondary">
              Use the search bar in the navigation to look up a brand, model,
              SKU, category, or display type.
            </p>
          </div>
        ) : pageProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {pageProducts.map((product, index) => {
                const productKey = `${product.slug}-${index}`;
                const productImage = failedImages.has(product.image)
                  ? "/baydoun-logo.webp"
                  : product.image;

                return (
                  <article
                    key={productKey}
                    className="group relative overflow-hidden border border-primary/10 bg-light-neutral shadow-[0_30px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
                  >
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      aria-label={`Add ${product.title} to wishlist`}
                      onClick={() => {
                        toggleWishlist(product.brand, product.slug);
                        toast.success(
                          `${product.title} ${
                            hasHydrated &&
                            wishlistItems.some(
                              (item) =>
                                item.productSlug === product.slug &&
                                item.productBrand === product.brand,
                            )
                              ? "removed from"
                              : "added to"
                          } wishlist`,
                          {
                            icon: "❤️",
                          },
                        );
                      }}
                      className={`hidden absolute right-4 top-4 z-10 sm:flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur transition duration-300 ${
                        hasHydrated &&
                        wishlistItems.some(
                          (item) =>
                            item.productSlug === product.slug &&
                            item.productBrand === product.brand,
                        )
                          ? "border-primary bg-primary text-neutral"
                          : "border-white/15 bg-neutral/60 text-primary hover:bg-primary hover:text-neutral"
                      }`}
                    >
                      <Heart
                        size={19}
                        fill={
                          hasHydrated &&
                          wishlistItems.some(
                            (item) =>
                              item.productSlug === product.slug &&
                              item.productBrand === product.brand,
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <Link
                      href={`/collections/${product.brand}/${product.slug}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <div className="relative aspect-4/5 overflow-hidden bg-neutral">
                        <Image
                          src={productImage || "/baydoun-logo.webp"}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-700 ease-out group-hover:scale-105"
                          onError={() => markImageFailed(product.image)}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-neutral/70 via-transparent to-transparent" />

                        {/* Status Badges Container */}
                        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                          {product.isFeatured && (
                            <span className="hidden sm:inline-block border border-primary/30 bg-neutral/70 px-3 py-1 text-xs uppercase tracking-widest text-white backdrop-blur">
                              Featured
                            </span>
                          )}
                          {product.discount && product.discount > 0 && (
                            <span className="inline-block border border-red-500/30 bg-red-950/60 px-3 py-1 text-xs uppercase tracking-widest font-bold text-red-400 backdrop-blur">
                              Sale -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 w-fit rounded-full">
                            {product.brand}
                          </p>
                          <p className="min-h-14 text-sm sm:text-lg font-bold uppercase sm:leading-7 sm:tracking-widest text-white font-playfair">
                            {product.title}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
                          <div className="flex flex-wrap items-baseline gap-1">
                            {product.discount && product.discount > 0 ? (
                              <>
                                <span className="relative inline-block before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-full before:h-0.5 before:bg-secondary before:-rotate-12">
                                  {formatPrice(product.price)}
                                </span>

                                <p className="text-lg font-black tracking-wide text-primary">
                                  {formatPrice(
                                    product.price *
                                      (1 - product.discount / 100),
                                  )}
                                </p>
                              </>
                            ) : (
                              <p className="text-lg font-bold tracking-wide text-primary">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>

                          <span className="text-xs uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 w-fit">
                            View details
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
              <p className="text-xs uppercase tracking-widest text-secondary/60">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                {getPagination().map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="px-2 text-secondary/40"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`h-10 w-10 cursor-pointer border text-sm font-bold transition ${
                        item === page
                          ? "border-primary bg-primary text-neutral"
                          : "border-white/10 text-primary hover:border-primary/40"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="border border-white/10 bg-white/3 px-6 py-20 text-center">
            <p className="text-2xl font-bold uppercase tracking-widest text-white font-playfair">
              No watches found
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 tracking-wide text-secondary">
              No results matched &quot;{query}&quot;. Try a brand like Casio, a
              model number, or a broader category.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center justify-center bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-neutral transition hover:bg-secondary"
            >
              Browse collection
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResultsPage;
