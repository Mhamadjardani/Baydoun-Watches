import SalesPage from "@/components/sales/SalesPage";
import { getShopListings } from "@/lib/products";

export default async function Page() {
  const products = await getShopListings();
  const discounted = products.filter((p) => p.discount && p.discount > 0);

  return <SalesPage products={discounted} />;
}
