"use client";

import { ProductCard } from "@/lib/type";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const Hero2 = ({ products }: { products: ProductCard[] }) => {
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

  return (
    <section className="min-h-screen overflow-hidden py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-4 text-center md:px-8">
        <motion.p
          className="font-playfair text-3xl font-black uppercase tracking-[0.25em] text-white sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Curated Collection
        </motion.p>

        <motion.p
          className="mx-auto max-w-2xl text-sm leading-relaxed text-secondary md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          Discover our most iconic pieces, crafted with precision and elevated
          by timeless design
        </motion.p>

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
          {products
            .filter((p) => p.isFeatured)
            .slice(0, 4)
            .map((product, index) => (
              <motion.article
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="group relative overflow-hidden rounded-[28px] border border-primary/10 bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-primary/25 hover:shadow-[0_35px_90px_rgba(0,0,0,0.6)]"
              >
                <Link href={`/collections/${product.brand}/${product.slug}`}>
                  <div className="relative aspect-3/4 overflow-hidden rounded-3xl p-2">
                    <motion.img
                      src={getImage(product) || "/baydoun-logo.webp"}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full rounded-[20px] object-contain bg-[linear-gradient(145deg,#f8efe0_0%,#e4d7b5_100%)] p-3 transition-transform duration-1000 ease-out group-hover:scale-105"
                      onError={() => markImageFailed(product.image)}
                    />

                    <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/90 via-black/15 to-transparent" />

                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute left-[-130%] top-0 h-full w-1/3 rotate-12 bg-white/10 blur-3xl transition-all duration-1000 group-hover:left-[140%]" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 transition-all duration-500 group-hover:-translate-y-2 md:p-7">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-primary">
                        {product.brand}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-lg font-light tracking-wide text-white md:text-2xl">
                        {product.title}
                      </h3>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.35em] text-primary">
                          Discover
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="h-px w-8 bg-primary transition-all duration-300 group-hover:w-14" />

                          <svg
                            className="h-4 w-4 translate-x-0 text-primary transition-all duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14m-6-6 6 6-6 6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero2;
