"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Hero4 = () => {
  return (
    <section className="bg-light-neutral text-white py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="uppercase text-primary text-xs mb-6">
            Exclusive Collection
          </p>

          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Begin Your Journey
          </h2>

          <div className="w-24 h-px bg-primary mx-auto my-10" />

          <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg leading-relaxed">
            Discover our current collection of horological masterpieces,
            meticulously crafted to embody precision, heritage, and enduring
            elegance. For those seeking something truly unique, our dedicated
            concierges are available to discuss bespoke commissions.
          </p>

          <button className="cursor-pointer px-8 py-4 mt-10 bg-primary text-neutral uppercase tracking-wider text-sm font-medium hover:opacity-90 transition">
            <Link href="/collections" className="flex items-center gap-2">
              View Collection
            </Link>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero4;
