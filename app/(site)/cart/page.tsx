import ShoppingCartPage from "@/components/cart/ShoppingCartPage";
import { getShopListings } from "@/lib/products";

export default async function CartPage() {
  const products = await getShopListings();

  return <ShoppingCartPage products={products} />;
}
