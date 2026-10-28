"use client";

import {
  formatSubCategory,
  normalizeSubCategory,
  ProductCard,
} from "@/lib/type";
import { inStockFirst } from "@/components/OutOfStockBadge";
import PageHeader from "@/components/showroom/PageHeader";
import WatchCard from "@/components/showroom/WatchCard";
import { BRAND_LABELS } from "@/lib/showcase";
import { useCommerceStore } from "@/store/useCommerceStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";

type FilterKey = "brand" | "subCategory" | "gender" | "display";
type SortKey = "new-arrivals" | "featured" | "price-low" | "price-high";
export type CollectionFilterState = Record<FilterKey, string[]>;

const filters: { key: FilterKey; label: string }[] = [
  { key: "brand", label: "Brand" },
  // { key: "category", label: "Category" },
  { key: "subCategory", label: "Subcategory" },
  { key: "gender", label: "Gender" },
  { key: "display", label: "Display" },
];

const pageSize = 16;

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

const normalizeSubCategoryValue = normalizeSubCategory;

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
  const [sortBy, setSortBy] = useState<SortKey>("new-arrivals");
  const [page, setPage] = useState(1);
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  useEffect(() => {
    // Defer state updates to avoid synchronous setState inside effect
    const id = setTimeout(() => {
      setSelectedFilters(urlFilters);
      setOpenFilters((currentFilters) => {
        const keysFromUrl = filters
          .filter(({ key }) => urlFilters[key].length > 0)
          .map(({ key }) => key as FilterKey);

        const nextOpen = new Set<FilterKey>([...currentFilters, ...keysFromUrl]);

        // Open subcategory filters whenever a brand filter is active.
        if (urlFilters.brand.length > 0) nextOpen.add("subCategory");
        else nextOpen.delete("subCategory");

        return Array.from(nextOpen);
      });
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

  const getOptions = (key: FilterKey) => {
    if (key === "subCategory") {
      return Array.from(
        new Set(
          products.map((product) =>
            normalizeSubCategoryValue(product.subCategory, product.brand),
          ),
        ),
      ).filter(Boolean);
    }

    return Array.from(new Set(products.map((product) => product[key]))).filter(
      Boolean,
    );
  };

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0,
  );

  const filteredProducts = useMemo(() => {
    // 1. Keep your filtering logic exactly the same
    const matchesFilters = products.filter((product) =>
      filters.every(({ key }) => {
        const selectedValues = selectedFilters[key];
        const productValue =
          key === "subCategory"
            ? normalizeSubCategoryValue(product.subCategory, product.brand)
            : product[key];

        return (
          selectedValues.length === 0 ||
          (productValue && selectedValues.includes(productValue))
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

    // 2. Perform the sort based on the calculated effective prices.
    // Out-of-stock watches always go last, whatever the sort.
    return [...matchesFilters].sort((firstProduct, secondProduct) => {
      const stockOrder = inStockFirst(firstProduct, secondProduct);
      if (stockOrder !== 0) return stockOrder;

      if (sortBy === "price-low" || sortBy === "price-high") {
        const priceA = getEffectivePrice(firstProduct);
        const priceB = getEffectivePrice(secondProduct);

        return sortBy === "price-low" ? priceA - priceB : priceB - priceA;
      }

      // New arrivals are the default priority; featured items break ties.
      if (sortBy === "new-arrivals") {
        const newArrivalOrder =
          Number(secondProduct.isNewArrival) - Number(firstProduct.isNewArrival);
        if (newArrivalOrder !== 0) return newArrivalOrder;
      }

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

      const nextFilters = { ...currentFilters, [key]: nextValues } as CollectionFilterState;

      // Open subcategories for any selected brand with subcategory products.
      if (key === "brand") {
        if (nextValues.length > 0) {
          setOpenFilters((cur) => (cur.includes("subCategory") ? cur : [...cur, "subCategory"]));
        } else {
          setOpenFilters((cur) => cur.filter((k) => k !== "subCategory"));
        }
      }

      return nextFilters;
    });

    setPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters(emptyFilters);
    setPage(1);
  };



  const productsRef = useRef<HTMLDivElement | null>(null);
  const shownPage = useRef(page);

  useEffect(() => {
    // When user changes page, scroll the products container into view.
    // Delay slightly and account for any fixed header so mobile scroll lands
    // the products grid at the top of the viewport instead of the page top.
    // Only when the page actually changes (not on first load), so the header stays in view.
    if (shownPage.current === page) return;
    shownPage.current = page;
    if (!productsRef.current) return;

    const id = window.setTimeout(() => {
      const el = productsRef.current as HTMLDivElement;
      const header = document.querySelector("header") as HTMLElement | null;
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 60);

    return () => clearTimeout(id);
  }, [page]);

  return (
    <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="The collection"
          title={["Every watch,", "one showroom"]}
          caption="Browse every piece we carry. Narrow it down by brand, line, wrist and display."
          aside={
            <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-5 py-3 font-jost text-sm text-ink/70">
              <SlidersHorizontal size={16} className="text-gold-deep" />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={filteredProducts.length}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-xl text-ink"
                >
                  {filteredProducts.length}
                </motion.span>
              </AnimatePresence>
              watches
            </div>
          }
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
          {/* ── Filters ─────────────────────────────────────────── */}
          <aside className="h-fit font-jost lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-gold/25 pb-4">
              <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-gold-deep">
                FILTERS
                {activeFilterCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] tracking-normal text-ink">
                    {activeFilterCount}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                className="cursor-pointer text-xs tracking-[0.12em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline disabled:cursor-default disabled:opacity-30 disabled:no-underline"
              >
                Clear all
              </button>
            </div>

            <div className="divide-y divide-gold/20">
              {filters
                .filter((filter) => filter.key !== "subCategory" || selectedFilters.brand.length > 0)
                .map((filter) => {
                  const isOpen = openFilters.includes(filter.key);

                  // Subcategories only for the selected brands
                  let options = getOptions(filter.key);
                  if (filter.key === "subCategory" && selectedFilters.brand.length > 0) {
                    options = Array.from(
                      new Set(
                        products
                          .filter((p) => selectedFilters.brand.includes(p.brand))
                          .map((p) => normalizeSubCategoryValue(p.subCategory, p.brand)),
                      ),
                    ).filter(Boolean);
                  }
                  const groupActiveCount = selectedFilters[filter.key]?.length || 0;

                  return (
                    <div key={filter.key}>
                      <button
                        type="button"
                        onClick={() => toggleFilterGroup(filter.key)}
                        aria-expanded={isOpen}
                        className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
                      >
                        <span className="flex items-center gap-2 font-serif text-2xl font-light">
                          {filter.label}
                          {groupActiveCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-ink/40 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-deep" : ""}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.2, 0.9, 0.1, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-5">
                              {options.map((option) => {
                                const checked = selectedFilters[filter.key].includes(option!);
                                const optionItemCount = products.filter((p) => {
                                  if (filter.key === "subCategory") {
                                    return normalizeSubCategoryValue(p.subCategory, p.brand) === option;
                                  }
                                  return p[filter.key] === option || p.brand === option;
                                }).length;
                                const label =
                                  filter.key === "subCategory"
                                    ? formatSubCategory(option ?? "")
                                    : filter.key === "brand"
                                      ? (BRAND_LABELS[option as ProductCard["brand"]] ?? option)
                                      : option;

                                return (
                                  <label
                                    key={`${filter.key}-${option}`}
                                    className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[#f6f5f1]"
                                  >
                                    <span className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleFilterValue(filter.key, option!)}
                                        className="peer sr-only"
                                      />
                                      <span
                                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${
                                          checked ? "border-gold bg-gold" : "border-ink/25 group-hover:border-gold"
                                        }`}
                                      >
                                        {checked && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                                      </span>
                                      <span className={checked ? "text-ink" : "text-ink/70"}>{label}</span>
                                    </span>
                                    <span className="text-xs tabular-nums text-ink/35">{optionItemCount}</span>
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

          {/* ── Results ─────────────────────────────────────────── */}
          <div ref={productsRef}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/25 pb-4 font-jost">
              <p className="text-sm text-ink/55">
                Showing {filteredProducts.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length}
              </p>
              <label className="flex items-center gap-3 text-sm text-ink/55">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value as SortKey);
                    setPage(1);
                  }}
                  className="cursor-pointer rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors hover:border-gold focus:border-gold"
                >
                  <option value="new-arrivals">New arrivals first</option>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                </select>
              </label>
            </div>

            <motion.ul
              key={`${page}-${sortBy}-${activeFilterCount}`}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4"
            >
              {pageProducts.map((product, index) => {
                const wishlisted =
                  hasHydrated &&
                  wishlistItems.some(
                    (item) => item.productSlug === product.slug && item.productBrand === product.brand,
                  );
                return (
                  <motion.li
                    key={`${product.slug}-${index}`}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, ease: [0.2, 0.9, 0.1, 1] }}
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
            </motion.ul>

            {pageProducts.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-serif text-4xl font-light">No watches match these filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 cursor-pointer font-jost text-sm tracking-[0.14em] text-gold-deep underline-offset-4 hover:underline"
                >
                  Clear the filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Pages" className="mt-16 flex items-center justify-center gap-2 font-jost">
                {getPagination().map((item, index) =>
                  item === "..." ? (
                    <span key={`dots-${index}`} className="px-2 text-ink/30">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      aria-current={item === page ? "page" : undefined}
                      className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full text-sm tabular-nums transition-all ${
                        item === page ? "bg-ink text-paper" : "text-ink/60 hover:bg-[#f6f5f1] hover:text-ink"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsCollection;
