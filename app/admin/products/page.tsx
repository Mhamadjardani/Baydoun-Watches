import { getKeystaticGitHubUser } from "../../../lib/adminAuth";
import { getAllProducts } from "../../../lib/products";
import ProductImageAdmin from "./ProductImageAdmin";

export const dynamic = "force-dynamic";

export default async function ProductAdminPage() {
  const user = await getKeystaticGitHubUser();
  const products = await getAllProducts();

  return (
    <ProductImageAdmin
      products={products}
      githubLogin={user?.login ?? "Not signed in"}
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
    />
  );
}
