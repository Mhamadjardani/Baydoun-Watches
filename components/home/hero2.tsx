"use client";

import { Product } from "@/lib/type";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero2 = ({ products }: { products: Product[] }) => {
  return (
    <section className="min-h-screen overflow-hidden py-20">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-4 text-center md:px-8">
        <motion.p
          className="text-4xl font-black uppercase tracking-widest text-white md:text-6xl font-playfair"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Curated Collections
        </motion.p>

        <motion.p
          className="mx-auto max-w-2xl text-sm tracking-widest text-secondary md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          Discover our most iconic pieces, crafted with precision and elevated
          by timeless design
        </motion.p>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
          {products.slice(0, 3).map((product, index) => (
            <motion.article
              key={`hero2-product-${index}`}
              className="group relative overflow-hidden border border-white/10 rounded-3xl bg-primary/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out hover:shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: index * 0.08,
              }}
            >
              <motion.img
                src={product.images[0] || "/baydoun-logo.webp"}
                alt={product.title}
                className="h-105 w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-neutral to-neutral/30" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <p className="text-xs uppercase tracking-widest text-primary py-1 px-2 bg-primary/10 w-fit rounded-full">
                  {product.category}
                </p>
                <p className="mt-3 text-2xl font-bold uppercase tracking-widest text-white font-playfair">
                  {product.brand}
                </p>
                <p className="mt-2 max-w-48 text-sm text-secondary">
                  {product.title}
                </p>
                <Link
                  href={`/collections/${product.brand}/${product.slug}`}
                  className="cursor-pointer mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition hover:text-secondary"
                >
                  Explore
                  <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero2;
