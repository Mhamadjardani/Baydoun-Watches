import ProductDetails from "@/components/productDetail/details";
import { getAllProductParams, getProduct, type Brand } from "@/lib/products";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllProductParams();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ brand: Brand; slug: string }>;
}) {
  const { brand, slug } = await params;

  const product = await getProduct(brand, slug);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}