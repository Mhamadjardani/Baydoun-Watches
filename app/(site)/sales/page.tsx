import SalesPage from "@/components/sales/SalesPage";
import { getShopProducts } from "@/lib/products";

export default async function Page() {
  const products = await getShopProducts();
  const discounted = products.filter((p) => p.discount && p.discount > 0);

  return <SalesPage products={discounted} />;
}
