import WishlistPage from "@/components/wishlist/WishlistPage";
import { getShopProducts } from "@/lib/products";

export default async function WishlistRoute() {
  const products = await getShopProducts();

  return <WishlistPage products={products} />;
}
