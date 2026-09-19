import SalesPage from "@/components/sales/SalesPage";
import { getAllProducts } from "@/lib/products";

export default async function Page() {
  const products = await getAllProducts();
  const discounted = products.filter((p) => p.discount && p.discount > 0);

  return <SalesPage products={discounted} />;
}
