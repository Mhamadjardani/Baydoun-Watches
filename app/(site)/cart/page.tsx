import ShoppingCartPage from "@/components/cart/ShoppingCartPage";
import { getShopProducts } from "@/lib/products";

export default async function CartPage() {
  const products = await getShopProducts();

  return <ShoppingCartPage products={products} />;
}
