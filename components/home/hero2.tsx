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
            .filter((p) => (p.isFeatured = true))
            .slice(0, 4)
            .map((product, index) => (
              <motion.article
                key={product.slug}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
              >
                <Link href={`/collections/${product.brand}/${product.slug}`}>
                  <div className="relative aspect-3/4 md:aspect-4/5 overflow-hidden">
                    <motion.img
                      src={getImage(product) || "/baydoun-logo.webp"}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => markImageFailed(product.image)}
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />

                    {/* category */}
                    {/* <div className="absolute left-3 top-3 md:left-5 md:top-5">
                    <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md md:px-3 md:text-xs">
                      {product.category}
                    </span>
                  </div> */}

                    {/* content */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-6">
                      {/* <p className="font-playfair text-base font-bold uppercase tracking-[0.15em] text-white sm:text-lg md:text-2xl">
                      {product.brand}
                    </p> */}

                      <p className="mt-1 line-clamp-1 text-xs text-secondary sm:text-sm md:mt-2 md:line-clamp-2">
                        {product.title}
                      </p>

                      <div className="mt-3 flex items-center justify-between md:mt-5">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-primary md:text-xs">
                          Explore
                        </span>

                        <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
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
