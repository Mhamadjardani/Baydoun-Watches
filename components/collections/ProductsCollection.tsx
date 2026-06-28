"use client";

import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type FilterKey = "brand" | "subCategory" | "gender" | "display";
type SortKey = "featured" | "price-low" | "price-high";
export type CollectionFilterState = Record<FilterKey, string[]>;

const filters: { key: FilterKey; label: string }[] = [
  { key: "brand", label: "Brand" },
  // { key: "category", label: "Category" },
  { key: "subCategory", label: "subCategory" },
  { key: "gender", label: "Gender" },
  { key: "display", label: "Display" },
];

const pageSize = 16;

const formatPrice = (price: ProductCard["price"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const emptyFilters: CollectionFilterState = {
  brand: [],
  // category: [],
  subCategory: [],
  gender: [],
  display: [],
};

const filterKeys = [
  "brand",
  // "category",
  "subCategory",
  "gender",
  "display",
] as const;

const buildFiltersFromSearchParams = (searchParams: URLSearchParams) =>
  filterKeys.reduce<CollectionFilterState>(
    (currentFilters, key) => ({
      ...currentFilters,
      [key]: searchParams.getAll(key).filter(Boolean),
    }),
    emptyFilters,
  );

const ProductsCollection = ({
  initialFilters = emptyFilters,
  products,
}: {
  initialFilters?: CollectionFilterState;
  products: ProductCard[];
}) => {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const urlFilters = useMemo(
    () =>
      searchParamsString
        ? buildFiltersFromSearchParams(new URLSearchParams(searchParamsString))
        : initialFilters,
    [initialFilters, searchParamsString],
  );
  const [openFilters, setOpenFilters] = useState<FilterKey[]>([
    "brand",
    // "category",
  ]);
  const [selectedFilters, setSelectedFilters] =
    useState<CollectionFilterState>(urlFilters);
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  useEffect(() => {
    // Defer state updates to avoid synchronous setState inside effect
    const id = setTimeout(() => {
      setSelectedFilters(urlFilters);
      setOpenFilters((currentFilters) =>
        Array.from(
          new Set([
            ...currentFilters,
            ...filters
              .filter(({ key }) => urlFilters[key].length > 0)
              .map(({ key }) => key),
          ]),
        ),
      );
      setPage(1);
    }, 0);
    return () => clearTimeout(id);
  }, [urlFilters]);

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

  const getOptions = (key: FilterKey) =>
    Array.from(new Set(products.map((product) => product[key]))).filter(
      Boolean,
    );

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0,
  );

  const filteredProducts = useMemo(() => {
    // 1. Keep your filtering logic exactly the same
    const matchesFilters = products.filter((product) =>
      filters.every(({ key }) => {
        const selectedValues = selectedFilters[key];
        return (
          selectedValues.length === 0 ||
          (product[key] && selectedValues.includes(product[key]))
        );
      }),
    );

    // Helper utility function to get the final price based on the discount math
    const getEffectivePrice = (product: ProductCard) => {
      if (product.discount && product.discount > 0) {
        return product.price * (1 - product.discount / 100);
      }
      return product.price;
    };

    // 2. Perform the sort based on the calculated effective prices
    return [...matchesFilters].sort((firstProduct, secondProduct) => {
      if (sortBy === "price-low" || sortBy === "price-high") {
        const priceA = getEffectivePrice(firstProduct);
        const priceB = getEffectivePrice(secondProduct);

        return sortBy === "price-low" ? priceA - priceB : priceB - priceA;
      }

      // Default sorting fallback: Featured items first
      return Number(secondProduct.isFeatured) - Number(firstProduct.isFeatured);
    });
  }, [selectedFilters, sortBy, products]);

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
                Collection
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
          <aside className="h-fit rounded-lg border border-white/5 bg-neutral/40 backdrop-blur-md shadow-2xl lg:sticky lg:top-24">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  Filters
                </p>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    {activeFilterCount}
                  </span>
                )}
              </div>
            </div>

            {/* Filter Groups Stack */}
            <div className="divide-y divide-white/5">
              {filters
                .filter(
                  (filter) =>
                    filter.key !== "subCategory" ||
                    selectedFilters.brand.length > 0,
                )
                .map((filter) => {
                  const isOpen = openFilters.includes(filter.key);

                  // SubCategory filtering logic preserved
                  let options = getOptions(filter.key);
                  if (
                    filter.key === "subCategory" &&
                    selectedFilters.brand.length > 0
                  ) {
                    options = Array.from(
                      new Set(
                        products
                          .filter((p) =>
                            selectedFilters.brand.includes(p.brand),
                          )
                          .map((p) => p.subCategory),
                      ),
                    ).filter(Boolean);
                  }

                  // Count active items inside THIS specific category group
                  const groupActiveCount =
                    selectedFilters[filter.key]?.length || 0;

                  return (
                    <div key={filter.key} className="overflow-hidden">
                      {/* Accordion Trigger Head */}
                      <button
                        type="button"
                        onClick={() => toggleFilterGroup(filter.key)}
                        className="flex w-full cursor-pointer items-center justify-between px-6 py-4.5 text-left transition duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-white/90">
                            {filter.label}
                          </span>
                          {groupActiveCount > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <ChevronDown
                          size={14}
                          className={`text-white/40 transition-transform duration-300 ease-out ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {/* Framer Motion Height Accordion for Liquid Smooth Transitions */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="space-y-3 px-6 pb-6 pt-1">
                              {options.map((option) => {
                                const checked = selectedFilters[
                                  filter.key
                                ].includes(option!);

                                // Calculate how many products match this option item dynamically
                                const optionItemCount = products.filter(
                                  (p) =>
                                    p[filter.key] === option ||
                                    p.brand === option,
                                ).length;

                                return (
                                  <label
                                    key={`${filter.key}-${option}`}
                                    className="group flex cursor-pointer items-center justify-between text-sm text-secondary transition duration-200 hover:text-white"
                                  >
                                    <div className="flex items-center gap-3.5">
                                      {/* Hidden standard Checkbox native element */}
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          toggleFilterValue(filter.key, option!)
                                        }
                                        className="sr-only"
                                      />

                                      {/* Modern Premium Custom Interactive Checkbox Component */}
                                      <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-all duration-200 ${
                                          checked
                                            ? "border-primary bg-primary text-background"
                                            : "border-white/20 bg-transparent group-hover:border-white/40"
                                        }`}
                                      >
                                        {checked && (
                                          <svg
                                            className="h-2.5 w-2.5 stroke-current fill-none stroke-3"
                                            viewBox="0 0 24 24"
                                          >
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </div>

                                      {/* Capitalized text label option */}
                                      <span className="text-sm sm:text-base tracking-wide font-medium">
                                        {option &&
                                          option.charAt(0).toUpperCase() +
                                            option.slice(1)}
                                      </span>
                                    </div>

                                    {/* Optional: Minimal Product Item Count on right end */}
                                    <span className="text-[10px] tabular-nums text-white/30 group-hover:text-white/50 transition">
                                      ({optionItemCount})
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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

            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
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
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsCollection;
