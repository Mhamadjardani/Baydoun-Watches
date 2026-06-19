"use client";

import { Product } from "@/lib/type";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero4 = ({ products }: { products: Product[] }) => {
  const router = useRouter();

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
            <p className="mx-auto max-w-xl text-xs sm:text-sm md:text-base tracking-[0.25em] text-secondary">
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
          {products
            .filter((p) => p.brand == "casio")
            .slice(0, 4)
            .map((product, index) => (
              <motion.article
                key={`hero4-product-${index}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-light-neutral shadow-[0_30px_90px_rgba(0,0,0,0.45)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
                onClick={() => {
                  router.push(`/collections/${product.brand}/${product.slug}`);
                }}
              >
                <div className="relative aspect-4/5 overflow-hidden bg-neutral">
                  <motion.img
                    src={product.images[0] || "/baydoun-logo.webp"}
                    alt={product.title}
                    className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-neutral/60 via-neutral/20 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 md:p-6 text-left">
                  <div className="space-y-2">
                    <p className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-primary md:text-xs">
                      {product.brand}
                    </p>
                    <p className="font-playfair mt-3 line-clamp-2 text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base md:text-lg">
                      {product.title}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-base font-bold tracking-wide text-primary md:text-lg">
                      ${product.price || "0"}
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
