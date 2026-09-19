import ProductDetails from "@/components/productDetail/details";
import { getAllProducts, getProduct, type Brand } from "@/lib/products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ brand: Brand; slug: string }>;
}) {
  const { brand, slug } = await params;

  const product = await getProduct(brand, slug);
  const products = await getAllProducts();

  if (!product) notFound();

  return <ProductDetails products={products} product={product} />;
}
