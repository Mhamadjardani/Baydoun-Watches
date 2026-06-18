"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    title: "For Him",
    subtitle: "Collection",
    description:
      "Classic and contemporary timepieces crafted for confidence and everyday elegance.",
    image: "/for-man.jpg",
    url: "/collections?gender=Men",
  },
  {
    title: "For Her",
    subtitle: "Collection",
    description:
      "Graceful watches designed to complement every outfit and every occasion.",
    image: "/for-woman.jpg",
    url: "/collections?gender=Women",
  },
  {
    title: "Best Sellers",
    subtitle: "Editor's Pick",
    description:
      "Explore our most loved watches chosen by customers for their timeless appeal.",
    image: "/best-seller.jpg",
    url: "/collections?featured=true",
  },
];

export default function Hero6() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-425 px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-primary">
            Discover
          </p>

          <h2 className="mt-5 font-playfair text-4xl uppercase tracking-[0.12em] text-white sm:text-5xl lg:text-6xl">
            Curated Collections
          </h2>

          <div className="mx-auto mt-8 h-px w-24 bg-primary" />

          <p className="mt-8 text-lg leading-8 text-secondary/70">
            Explore carefully selected collections designed for every style,
            occasion, and personality.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_1.1fr]">
          {collections.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
              }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-4xl border border-white/10 bg-neutral shadow-[0_35px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="relative h-155 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 bg-linear-to-b from-primary/5 opacity-0 transition duration-500 group-hover:opacity-100" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  {item.subtitle}
                </p>

                <h3 className="mt-3 font-playfair text-3xl uppercase tracking-[0.12em] text-white lg:text-4xl">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-sm leading-7 text-secondary/80">
                  {item.description}
                </p>

                <Link
                  href={item.url}
                  className="mt-8 inline-flex items-center gap-3 border border-primary/25 bg-primary/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary/15"
                >
                  Explore Collection
                  <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
