import WishlistPage from "@/components/wishlist/WishlistPage";
import { getShopListings } from "@/lib/products";

export default async function WishlistRoute() {
  const products = await getShopListings();

  return <WishlistPage products={products} />;
}
