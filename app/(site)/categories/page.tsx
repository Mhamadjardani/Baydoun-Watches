import CategoriesPage from "@/components/categories/CategoriesPage";
import { getShopListings } from "@/lib/products";

export default async function Page() {
  const products = await getShopListings();

  return <CategoriesPage products={products} />;
}
