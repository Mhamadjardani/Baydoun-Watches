"use client";

import { inStockFirst } from "@/components/OutOfStockBadge";
import PageHeader from "@/components/showroom/PageHeader";
import WatchCard from "@/components/showroom/WatchCard";
import { getSearchableProductText, ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const matchesSearch = (product: ProductCard, query: string) => {
  return getSearchableProductText(product).includes(query.toLowerCase());
};

const SearchResultsPage = ({ products }: { products: ProductCard[] }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const normalizedQuery = query.trim().toLowerCase();
  const pageSize = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [page, normalizedQuery]);

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return products
      .filter((product) => matchesSearch(product, normalizedQuery))
      .sort(
        (firstProduct, secondProduct) =>
          inStockFirst(firstProduct, secondProduct) ||
          firstProduct.title.localeCompare(secondProduct.title),
      );
  }, [normalizedQuery, products]);

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
    <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Search"
          title={[query ? `“${query}”` : "Find a watch"]}
          caption={
            query
              ? `${results.length} ${results.length === 1 ? "watch matches" : "watches match"} your search.`
              : "Search by brand, model, reference number or style."
          }
          aside={
            <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-5 py-3 font-jost text-sm text-ink/70">
              <Search size={16} className="text-gold-deep" />
              <span className="font-serif text-xl text-ink">{results.length}</span>
              results
            </div>
          }
        />

        {!normalizedQuery ? (
          <div className="py-24 text-center">
            <p className="font-serif text-4xl font-light">What are you looking for?</p>
            <p className="mx-auto mt-4 max-w-md font-jost text-ink/60">
              Use the search in the menu to look up a brand, a model, a reference number or a style.
            </p>
          </div>
        ) : pageProducts.length > 0 ? (
          <>
            <motion.ul
              key={`${normalizedQuery}-${page}`}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4"
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
          </>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-4xl font-light">No watches found for “{query}”.</p>
            <p className="mx-auto mt-4 max-w-md font-jost text-ink/60">
              Try a brand like Casio, a model number, or a broader word such as “chronograph”.
            </p>
            <Link
              href="/collections"
              className="group relative mt-8 inline-flex overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors group-hover:text-ink">Browse the collection</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;
