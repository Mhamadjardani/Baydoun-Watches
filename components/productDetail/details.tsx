"use client";

import type { ProductCard, ProductDetails } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { motion } from "framer-motion";
import { Check, Heart, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (price: ProductDetails["price"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const ProductDetails = ({
  product,
  products,
}: {
  product: ProductDetails;
  products: ProductCard[];
}) => {
  const fallbackImage = "/baydoun-logo.webp";
  const [activeImage, setActiveImage] = useState(
    product.images[0] ?? fallbackImage,
  );
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);
  const cartItems = useCommerceStore((state) => state.cartItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const activeDisplayImage = failedImages.has(activeImage)
    ? fallbackImage
    : activeImage;
  const isWishlisted =
    hasHydrated &&
    wishlistItems.some(
      (item) =>
        item.productSlug === product.slug &&
        item.productBrand === product.brand,
    );
  const cartQuantity =
    cartItems.find((item) => item.productSlug === product.slug)?.quantity ?? 0;

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const getImage = (product: ProductCard) =>
    failedImages.has(product.image) ? "/baydoun-logo.webp" : product.image;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrame: number;
    const speed = 0.5;

    const step = () => {
      if (!container) return;

      container.scrollLeft += speed;

      // seamless reset (half because duplicated list)
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const productDetails = [
    { label: "Brand", value: product.brand },
    // { label: "Category", value: product.category },
    // { label: "Collection", value: product.subCategory },
    { label: "Gender", value: product.gender },
    { label: "Display", value: product.display },
    { label: "SKU", value: product.sku },
  ];

  return (
    <section className="min-h-screen overflow-hidden bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16 space-y-10">
      <div className="mx-auto grid max-w-screen-2xl gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(360px,1fr)] lg:gap-12">
        <motion.div
          className="mx-auto w-full max-w-107.5 space-y-3"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/4.8] w-full overflow-hidden rounded-xl border border-primary/15 bg-[#f7f3ea] shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:aspect-4/4.5 lg:aspect-[4/4.8]">
            <Image
              key={activeDisplayImage}
              src={activeDisplayImage}
              alt={product.title}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-contain p-5 transition duration-700 ease-out hover:scale-[1.02]"
              onError={() => markImageFailed(activeImage)}
            />
            <div className="absolute inset-0 bg-linear-to-tr from-neutral/30 via-transparent to-primary/10" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.isNewArrival && (
                <span className="border border-primary/30 bg-neutral/70 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
                  New arrival
                </span>
              )}
              {product.isFeatured && (
                <span className="border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-secondary backdrop-blur">
                  Featured
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="inline-block border border-red-500/30 bg-red-950/60 px-3 py-1 text-sm uppercase tracking-widest font-bold text-red-400 backdrop-blur">
                  Sale -{product.discount}%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 overflow-x-auto pb-1 md:grid-cols-5">
            {product.images.map((image, index) => {
              const isActive = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`View ${product.title} image ${index + 1}`}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-[#f7f3ea] transition duration-300 focus:outline-none sm:h-24 sm:w-24 ${
                    isActive
                      ? "border-primary shadow-[0_0_0_1px_rgba(201,168,76,0.4)]"
                      : "border-white/10 opacity-75 hover:border-primary/50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={
                      (failedImages.has(image) ? fallbackImage : image) ||
                      "baydoun-logo/webp"
                    }
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                    onError={() => markImageFailed(image)}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-primary/25 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
                {product.brand}
              </span>
              {/* <span className="text-xs uppercase tracking-widest text-secondary/70">
                {product.category}
                / {product.subCategory}
              </span> */}
            </div>

            <div className="space-y-4">
              <p className="sm:text-2xl uppercase text-white">
                {product.title}
              </p>
              <p className="max-w-2xl text-sm leading-7 tracking-wide text-secondary/80 md:text-base">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-y border-white/10 py-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-secondary/60">
                  Price
                </p>
                {product.discount && product.discount > 0 ? (
                  <>
                    <span className="relative inline-block before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-full before:h-0.5 before:bg-secondary before:-rotate-12">
                      {formatPrice(product.price)}
                    </span>

                    <p className="text-3xl font-black tracking-wide text-primary">
                      {formatPrice(
                        product.price * (1 - product.discount / 100),
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold tracking-wide text-primary">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-secondary">
                <ShieldCheck size={18} className="text-primary" />
                {/* {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"} */}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {productDetails
              .filter((detail) => detail.value)
              .map((detail) => (
                <div
                  key={detail.label}
                  className="border border-white/10 bg-white/3 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-widest text-secondary/50">
                    {detail.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-wide text-white">
                    {detail.value}
                  </p>
                </div>
              ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Features
              </p>
              <ul className="grid gap-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-white"
                  >
                    <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Specifications
              </p>
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {product.specifications.map((specification) => (
                  <div
                    key={specification.label}
                    className="grid grid-cols-[minmax(110px,0.85fr)_1fr] gap-4 py-3 text-sm"
                  >
                    <dt className="uppercase tracking-widest text-secondary/50">
                      {specification.label}
                    </dt>
                    <dd className="font-semibold tracking-wide text-white">
                      {specification.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                // if (product.stock > 0) {
                addToCart(product.brand, product.slug);
                toast.success(`${product.title} added to cart`, {
                  icon: "🛒",
                });
                // }
              }}
              className={`inline-flex h-13 flex-1 items-center justify-center gap-3 bg-primary cursor-pointer px-6 py-2 text-sm font-bold uppercase tracking-widest text-neutral transition duration-300 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40`}
            >
              <ShoppingBag size={19} />
              {hasHydrated && cartQuantity > 0
                ? `In cart (${cartQuantity})`
                : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.brand, product.slug);
                toast.success(
                  `${product.title} ${isWishlisted ? "removed from" : "added to"} wishlist`,
                  {
                    icon: "❤️",
                  },
                );
              }}
              className="inline-flex h-13 flex-1 cursor-pointer items-center justify-center gap-3 border border-primary/30 bg-primary/10 px-6 py-2 text-sm font-bold uppercase tracking-widest text-primary transition duration-300 hover:border-primary/60 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? "Wishlisted" : "Add to wishlist"}
            </button>
          </div>
        </motion.div>
      </div>

      {products.filter((prod) => prod.brand == product.brand).length > 0 && (
        <section className="space-y-5 border-t border-white/10 pt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                You may also like
              </p>
            </div>
            <Link
              href={`/collections?brand=${product.brand}`}
              className="hidden text-xs font-bold uppercase tracking-widest text-primary transition hover:text-secondary sm:inline"
            >
              View all
            </Link>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-nowrap gap-4 overflow-x-auto pb-3 no-scrollbar"
            style={{ scrollBehavior: "auto" }}
          >
            {[
              ...products.filter((prod) => prod.brand == product.brand),
              ...products.filter((prod) => prod.brand == product.brand),
            ].map((product, index) => (
              <Link
                key={`${product.slug}-recommended-${index}`}
                href={`/collections/${product.brand}/${product.slug}`}
                className="group w-72 shrink-0 overflow-hidden rounded-3xl border border-primary/10 bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-primary/25"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-[#101010] p-2">
                  <Image
                    src={getImage(product) || "/baydoun-logo.webp"}
                    alt={product.title}
                    fill
                    sizes="224px"
                    className="rounded-2xl object-contain bg-[linear-gradient(145deg,#f8efe0_0%,#e4d7b5_100%)] p-3 transition duration-500 group-hover:scale-105"
                    onError={() => markImageFailed(product.image)}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]" />
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-widest text-primary">
                    {product.brand}
                  </p>
                  <p className="min-h-11 text-sm font-bold uppercase leading-5 tracking-widest text-white font-playfair">
                    {product.title}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default ProductDetails;
