import ProductDetails from "@/components/productDetail/details";
import { getAllProducts, getProduct, isBrand, type Brand } from "@/lib/products";
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

  const product = await getProduct(brand, slug);
  const products = await getAllProducts();

  if (!product) notFound();

  return <ProductDetails products={products} product={product} />;
}
