"use client";

import { Product } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { ChevronDown, Heart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FilterKey =
  | "brand"
  | "category"
  // | "subCategory"
  | "gender"
  | "display";
type SortKey = "featured" | "price-low" | "price-high";
export type CollectionFilterState = Record<FilterKey, string[]>;

const filters: { key: FilterKey; label: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  // { key: "subCategory", label: "Collection" },
  { key: "gender", label: "Gender" },
  { key: "display", label: "Display" },
];

const pageSize = 6;

const formatPrice = (price: Product["price"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const emptyFilters: CollectionFilterState = {
  brand: [],
  category: [],
  // subCategory: [],
  gender: [],
  display: [],
};

const ProductsCollection = ({
  initialFilters = emptyFilters,
  products,
}: {
  initialFilters?: CollectionFilterState;
  products: Product[];
}) => {
  const [openFilters, setOpenFilters] = useState<FilterKey[]>([
    "brand",
    "category",
  ]);
  const [selectedFilters, setSelectedFilters] =
    useState<CollectionFilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  useEffect(() => {
    // Defer state updates to avoid synchronous setState inside effect
    const id = setTimeout(() => {
      setSelectedFilters(initialFilters);
      setOpenFilters((currentFilters) =>
        Array.from(
          new Set([
            ...currentFilters,
            ...filters
              .filter(({ key }) => initialFilters[key].length > 0)
              .map(({ key }) => key),
          ]),
        ),
      );
      setPage(1);
    }, 0);
    return () => clearTimeout(id);
  }, [initialFilters]);

  const getOptions = (key: FilterKey) =>
    Array.from(new Set(products.map((product) => product[key]))).filter(
      Boolean,
    );

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0,
  );

  const filteredProducts = useMemo(() => {
    const matchesFilters = products.filter((product) =>
      filters.every(({ key }) => {
        const selectedValues = selectedFilters[key];
        return (
          selectedValues.length === 0 || selectedValues.includes(product[key])
        );
      }),
    );

    return [...matchesFilters].sort((firstProduct, secondProduct) => {
      if (sortBy === "price-low")
        return firstProduct.price - secondProduct.price;
      if (sortBy === "price-high")
        return secondProduct.price - firstProduct.price;

      return Number(secondProduct.isFeatured) - Number(firstProduct.isFeatured);
    });
  }, [selectedFilters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const toggleFilterGroup = (key: FilterKey) => {
    setOpenFilters((currentFilters) =>
      currentFilters.includes(key)
        ? currentFilters.filter((filter) => filter !== key)
        : [...currentFilters, key],
    );
  };

  const toggleFilterValue = (key: FilterKey, value: string) => {
    setSelectedFilters((currentFilters) => {
      const currentValues = currentFilters[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value];

      return { ...currentFilters, [key]: nextValues };
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters(emptyFilters);
    setPage(1);
  };

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  return (
    <main className="min-h-screen bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Curated inventory
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                Collections
              </p>
              <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
                Explore selected timepieces with refined filtering, precise
                details, and a gallery built for confident comparison.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-4 py-3 text-xs uppercase tracking-widest text-primary">
              <SlidersHorizontal size={16} />
              {filteredProducts.length} pieces
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit border border-white/10 bg-white/3 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-widest text-white">
                Filters
              </p>
              <span className="text-xs uppercase tracking-widest text-primary">
                {activeFilterCount} active
              </span>
            </div>

            <div className="divide-y divide-white/10">
              {filters.map((filter) => {
                const isOpen = openFilters.includes(filter.key);

                return (
                  <div key={filter.key}>
                    <button
                      type="button"
                      onClick={() => toggleFilterGroup(filter.key)}
                      className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-semibold uppercase tracking-widest text-secondary transition hover:text-primary"
                    >
                      {filter.label}
                      <ChevronDown
                        size={18}
                        className={`transition duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="grid gap-3 px-5 pb-5">
                        {getOptions(filter.key).map((option) => {
                          const checked =
                            selectedFilters[filter.key].includes(option);

                          return (
                            <label
                              key={`${filter.key}-${option}`}
                              className="flex cursor-pointer items-center gap-3 text-sm tracking-wide text-secondary"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleFilterValue(filter.key, option)
                                }
                                className="h-4 w-4 accent-primary"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 border border-white/10 bg-white/3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={clearFilters}
                className="w-fit cursor-pointer text-xs font-bold uppercase tracking-widest text-primary transition hover:text-secondary disabled:cursor-not-allowed disabled:text-secondary/40"
                disabled={activeFilterCount === 0}
              >
                Clear filters
              </button>

              <label className="flex w-full items-center justify-between gap-3 sm:w-auto">
                <span className="text-xs uppercase tracking-widest text-secondary/60">
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value as SortKey);
                    setPage(1);
                  }}
                  className="h-11 min-w-54 border border-primary/20 bg-neutral px-4 text-sm font-semibold uppercase tracking-widest text-primary outline-none transition focus:border-primary/60"
                >
                  <option value="featured">Featured items</option>
                  <option value="price-low">Low price</option>
                  <option value="price-high">High price</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
              {pageProducts.map((product, index) => {
                const productKey = `${product.slug}-${index}`;
                const productImage = failedImages.has(product.images[0])
                  ? "/test.png"
                  : product.images[0];

                return (
                  <article
                    key={productKey}
                    className="group relative overflow-hidden border border-primary/10 bg-light-neutral shadow-[0_30px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
                  >
                    <button
                      type="button"
                      aria-label={`Add ${product.title} to wishlist`}
                      onClick={() =>
                        toggleWishlist(product.brand, product.slug)
                      }
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
                          src={productImage}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-700 ease-out group-hover:scale-105"
                          onError={() => markImageFailed(product.images[0])}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-neutral/70 via-transparent to-transparent" />
                        {product.isFeatured && (
                          <span className="hidden sm:block absolute left-4 top-4 border border-primary/30 bg-neutral/70 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
                            Featured
                          </span>
                        )}
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

                        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
                          <p className="text-lg font-bold tracking-wide text-primary">
                            {formatPrice(product.price)}
                          </p>
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

            {pageProducts.length === 0 && (
              <div className="border border-white/10 bg-white/3 px-6 py-16 text-center">
                <p className="text-sm uppercase tracking-widest text-secondary">
                  No watches match these filters.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
              <p className="text-xs uppercase tracking-widest text-secondary/60">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-10 w-10 cursor-pointer border text-sm font-bold transition ${
                      pageNumber === page
                        ? "border-primary bg-primary text-neutral"
                        : "border-white/10 text-primary hover:border-primary/40"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsCollection;
