"use client";

import { motion } from "framer-motion";

const Hero2 = () => {
  return (
    <section className="min-h-screen bg-secondary contrast-100 text-neutral flex items-center overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "auto" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-px bg-primary" />
                <p className="uppercase tracking-wide text-xs text-primary font-medium">
                  Established Excellence
                </p>
              </motion.div>

              <h2 className="font-playfair text-4xl md:text-5xl xl:text-6xl font-black leading-tight">
                The Philosophy
                <br />
                of Time
              </h2>
            </div>

            <div className="space-y-6 text-neutral/75 leading-relaxed text-base md:text-lg">
              <p>
                For more than four decades, Baydoun Watches has been at the
                centre of Beirut, offering a curated selection of high-quality
                watches, bracelets, and wallets. Our experience and dedication
                have made us a trusted destination for watch enthusiasts and
                first-time buyers alike, combining expert advice with a passion
                for exceptional products.
              </p>

              <p>
                We combine precision, style, and passion to offer the finest
                timepieces. Our mission is to provide quality watches,
                bracelets, and wallets that meet the highest standards of
                craftsmanship, while delivering exceptional customer service.
              </p>
            </div>

            <div className="flex gap-10 pt-4">
              <div>
                <p className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                  30+
                </p>
                <p className="text-xs uppercase text-neutral/60 mt-1">
                  Years Heritage
                </p>
              </div>

              <div>
                <p className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                  100%
                </p>
                <p className="text-xs uppercase text-neutral/60 mt-1">
                  Authentic
                </p>
              </div>

              <div>
                <p className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                  Swiss
                </p>
                <p className="text-xs uppercase text-neutral/60 mt-1">
                  Precision
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="relative border border-primary/20 bg-neutral/5 backdrop-blur-sm p-10 md:p-14">
              <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-primary/40" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-primary/40" />

              <p className="text-7xl font-playfair text-primary leading-none">
                “
              </p>

              <blockquote className="font-playfair text-2xl md:text-3xl leading-relaxed italic -mt-6">
                True luxury is silent. It does not demand attention; it
                patiently awaits discovery through the quiet appreciation of
                perfect mechanics.
              </blockquote>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-16 bg-primary" />
                <p className="uppercase tracking-wide text-xs text-primary">
                  HOROLOGUE • EST. 1987
                </p>
              </div>
            </div>

            <div className="absolute -z-10 inset-0 bg-primary/50 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
