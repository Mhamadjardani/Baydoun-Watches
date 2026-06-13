import ShoppingCartPage from "@/components/cart/ShoppingCartPage";
import { getAllProducts } from "@/lib/products";

export default async function CartPage() {
  const products = await getAllProducts();

  return <ShoppingCartPage products={products} />;
}
