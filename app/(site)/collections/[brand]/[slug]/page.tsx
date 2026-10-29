import ProductDetails from "@/components/productDetail/details";
import { getShopProducts, getShopProduct, isBrand, type Brand } from "@/lib/products";
import { BRAND_LABELS, finalPrice, formatPrice } from "@/lib/showcase";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ brand: Brand; slug: string }> };

// Link previews (WhatsApp orders, shares): the watch's photo, name and price.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { brand, slug } = await params;
  if (!isBrand(brand)) return {};
  const product = await getShopProduct(brand, slug);
  if (!product) return {};

  const title = `${product.title} | Baydoun Watches`;
  const description = `${BRAND_LABELS[brand] ?? brand}, ${formatPrice(finalPrice(product))}. Delivered across Lebanon.`;
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [{ url: image, alt: product.title }] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

// Render each product page on its first visit, then serve it statically until
// the next deploy (content edits in Keystatic commit to the repo and redeploy).
// Returning [] skips prerendering all products at build time.
export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({ params }: Params) {
  const { brand, slug } = await params;
  if (!isBrand(brand)) notFound();

  const product = await getShopProduct(brand, slug);
  const products = await getShopProducts();

  if (!product) notFound();

  return <ProductDetails products={products} product={product} />;
}
