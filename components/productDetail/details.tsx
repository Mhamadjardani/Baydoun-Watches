"use client";

import products from "@/data/products.json";
import { useCommerceStore } from "@/store/useCommerceStore";
import { motion } from "framer-motion";
import { Check, Heart, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type Product = (typeof products)[number];

const formatPrice = (price: Product["price"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const ProductDetails = ({ product = products[0] }: { product?: Product }) => {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const wishlistIds = useCommerceStore((state) => state.wishlistIds);
  const cartItems = useCommerceStore((state) => state.cartItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const fallbackImage = product.images[0];
  const activeDisplayImage = failedImages.has(activeImage)
    ? fallbackImage
    : activeImage;
  const isWishlisted = hasHydrated && wishlistIds.includes(product.id);
  const cartQuantity =
    cartItems.find((item) => item.productId === product.id)?.quantity ?? 0;

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const productDetails = [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Collection", value: product.subCategory },
    { label: "Gender", value: product.gender },
    { label: "Display", value: product.display },
    { label: "SKU", value: product.sku },
  ];

  return (
    <section className="min-h-screen overflow-hidden bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-16">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-primary/15 bg-light-neutral shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:aspect-5/4 lg:aspect-4/5">
            <Image
              key={activeDisplayImage}
              src={activeDisplayImage}
              alt={product.title}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover transition duration-700 ease-out hover:scale-105"
              onError={() => markImageFailed(activeImage)}
            />
            <div className="absolute inset-0 bg-linear-to-tr from-neutral/50 via-transparent to-primary/10" />
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
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto pb-1">
            {product.images.map((image, index) => {
              const isActive = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`View ${product.title} image ${index + 1}`}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-light-neutral transition duration-300 focus:outline-none sm:h-28 sm:w-28 ${
                    isActive
                      ? "border-primary shadow-[0_0_0_1px_rgba(201,168,76,0.4)]"
                      : "border-white/10 opacity-70 hover:border-primary/50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={failedImages.has(image) ? fallbackImage : image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-cover"
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
              <span className="text-xs uppercase tracking-widest text-secondary/70">
                {product.category} / {product.subCategory}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                {product.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 tracking-wide text-secondary/80 md:text-base">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-y border-white/10 py-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-secondary/60">
                  Price
                </p>
                <p className="mt-1 text-3xl font-bold tracking-wide text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-secondary">
                <ShieldCheck size={18} className="text-primary" />
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {productDetails.map((detail) => (
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
                    className="flex items-start gap-3 text-sm leading-6 text-secondary/85"
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
                addToCart(product.id);
                toast.success(`${product.title} added to cart`, {
                  icon: "🛒",
                });
              }}
              className="inline-flex h-13 flex-1 cursor-pointer items-center justify-center gap-3 bg-primary px-6 py-2 text-sm font-bold uppercase tracking-widest text-neutral transition duration-300 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <ShoppingBag size={19} />
              {hasHydrated && cartQuantity > 0
                ? `In cart (${cartQuantity})`
                : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
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
    </section>
  );
};

export default ProductDetails;
