import SearchResultsPage from "@/components/search/SearchResultsPage";
import { getAllProducts } from "@/lib/products";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const products = await getAllProducts();
  const { query = "" } = await searchParams;
  const searchQuery = Array.isArray(query) ? query[0] : query;

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
          <section className="mx-auto max-w-screen-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <p className="text-sm uppercase tracking-widest text-secondary">
              Loading collection
            </p>
          </section>
        </main>
      }
    >
      <SearchResultsPage products={products} query={searchQuery ?? ""} />{" "}
    </Suspense>
  );
}
