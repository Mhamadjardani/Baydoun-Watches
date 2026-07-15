"use client";

import { ProductCard } from "@/lib/type";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Hero4 = ({ products }: { products: ProductCard[] }) => {
  const router = useRouter();

  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const getImage = (product: ProductCard) =>
    failedImages.has(product.image) ? "/baydoun-logo.webp" : product.image;

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const casioSubcategories = Array.from(
    new Map(
      products
        .filter((p) => p.brand === "casio")
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? Date()).getTime() -
            new Date(a.createdAt ?? Date()).getTime(),
        )
        .map((p) => [p.subCategory, p]),
    ).values(),
  );

  return (
    <section className="min-h-screen overflow-hidden py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 md:gap-16 px-4 sm:px-8 md:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-center">
          <motion.div
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-playfair text-3xl font-black uppercase tracking-[0.2em] leading-tight text-white sm:text-5xl md:text-6xl">
              Discover Casio
            </p>
            <p className="mx-auto max-w-xl text-xs sm:text-sm md:text-base text-secondary">
              Curated selections representing the pinnacle of our horological
              achievements
            </p>

            <motion.button
              type="button"
              className="group cursor-pointer inline-flex items-center justify-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-8 py-3 text-sm uppercase tracking-widest text-primary transition duration-300 hover:border-primary/50 hover:bg-primary/15 focus:outline-none"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.12 }}
              onClick={() => {
                router.push("/collections?brand=casio");
              }}
            >
              view all
              <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {casioSubcategories.map((product, index) => (
            <motion.article
              key={`hero4-product-${index}`}
              className="cursor-pointer group flex flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-[#101010] shadow-[0_30px_90px_rgba(0,0,0,0.45)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              onClick={() => {
                router.push(
                  `/collections?brand=casio&subCategory=${product.subCategory}`,
                );
              }}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-[#101010] p-2">
                <motion.img
                  src={getImage(product) || "/baydoun-logo.webp"}
                  alt={product.title}
                  className="h-full w-full rounded-[20px] object-contain bg-[linear-gradient(145deg,#f8efe0_0%,#e4d7b5_100%)] p-3 transition-all duration-700 ease-out group-hover:scale-105"
                  onError={() => markImageFailed(product.image)}
                />
                <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
                <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/85 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 md:p-6 text-left">
                <div className="space-y-2">
                  <p className="font-playfair mt-3 line-clamp-2 text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base md:text-lg">
                    {(product.subCategory &&
                      product.subCategory
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")) ||
                      ""}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero4;
