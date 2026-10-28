import ProductDetails from "@/components/productDetail/details";
import { getShopProducts, getShopProduct, isBrand, type Brand } from "@/lib/products";
import { notFound } from "next/navigation";

// Render each product page on its first visit, then serve it statically until
// the next deploy (content edits in Keystatic commit to the repo and redeploy).
// Returning [] skips prerendering all products at build time.
export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ brand: Brand; slug: string }>;
}) {
  const { brand, slug } = await params;
  if (!isBrand(brand)) notFound();

  const product = await getShopProduct(brand, slug);
  const products = await getShopProducts();

  if (!product) notFound();

  return <ProductDetails products={products} product={product} />;
}
