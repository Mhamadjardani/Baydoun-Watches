import WishlistPage from "@/components/wishlist/WishlistPage";
import { getAllProducts } from "@/lib/products";

export default async function WishlistRoute() {
  const products = await getAllProducts();

  return <WishlistPage products={products} />;
}
