import CategoriesPage from "@/components/categories/CategoriesPage";
import { getAllProducts } from "@/lib/products";

export default async function Page() {
  const products = await getAllProducts();

  return <CategoriesPage products={products} />;
}
