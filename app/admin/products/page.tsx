import { getKeystaticGitHubUser } from "../../../lib/adminAuth";
import { getAllProducts, getAllProductsFromFiles } from "../../../lib/products";
import ProductImageAdmin from "./ProductImageAdmin";

export const dynamic = "force-dynamic";

export default async function ProductAdminPage() {
  const user = await getKeystaticGitHubUser();
  const loadedProducts = await getAllProducts();
  const products = loadedProducts.length > 0 ? loadedProducts : await getAllProductsFromFiles();

  return (
    <ProductImageAdmin
      products={products}
      githubLogin={user?.login ?? "Not signed in"}
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
    />
  );
}
