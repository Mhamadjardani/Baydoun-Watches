"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero5 = () => {
  return (
    <section className="min-h-screen overflow-hidden bg-neutral py-16 md:py-24">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-6 sm:px-10 md:gap-16 md:grid-cols-2 lg:px-16">
        {/* IMAGE */}
        <motion.div
          className="relative aspect-4/5 sm:aspect-4/4 lg:min-h-130 overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-slate-900/60 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Image
            src="/hero5.jpeg"
            alt="hero5"
            fill
            className="object-cover transition duration-700 ease-out hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-tr from-neutral/80 via-neutral/30 to-transparent" />
        </motion.div>

        {/* TEXT */}
        <motion.div
          className="flex flex-col justify-center gap-5 text-left text-foreground"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary/90">
            our heritage
          </p>

          <p className="font-playfair text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] leading-tight text-white">
            A Century of Precision
          </p>

          <p className="max-w-xl text-xs sm:text-sm md:text-base tracking-widest text-secondary/80 leading-relaxed">
            For more than four decades, Baydoun Watches has been at the centre
            of Beirut, offering a curated selection of high-quality watches,
            bracelets, and wallets.
          </p>

          <Link
            href="/heritage"
            className="group mt-2 inline-flex w-fit items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-6 py-2.5 text-xs sm:text-sm uppercase tracking-[0.3em] text-primary transition duration-300 hover:border-primary/50 hover:bg-primary/20"
          >
            read our story
            <span className="h-px w-8 bg-primary transition-all duration-300 group-hover:w-14" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero5;
