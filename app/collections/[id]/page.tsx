import ProductDetails from "@/components/productDetail/details";
import products from "@/data/products.json";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Array.from(new Set(products.map((product) => product.id))).map((id) => ({
    id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}
