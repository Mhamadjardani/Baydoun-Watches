import CategoriesPage from "@/components/categories/CategoriesPage";
import { getShopProducts } from "@/lib/products";

export default async function Page() {
  const products = await getShopProducts();

  return <CategoriesPage products={products} />;
}
