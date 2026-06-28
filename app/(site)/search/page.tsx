import SearchResultsPage from "@/components/search/SearchResultsPage";
import { getAllProducts } from "@/lib/products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const products = await getAllProducts();
  const { query = "" } = await searchParams;
  const searchQuery = Array.isArray(query) ? query[0] : query;

  return <SearchResultsPage products={products} query={searchQuery ?? ""} />;
}
