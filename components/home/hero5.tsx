"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero5 = () => {
  return (
    <section className="min-h-screen overflow-hidden bg-neutral py-24">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-6 sm:grid-cols-2 sm:px-10 md:gap-16 lg:px-16">
        <motion.div
          className="relative min-h-130 overflow-hidden rounded-4xl border border-white/10 bg-slate-900/60 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Image
            src="/hero5.png"
            alt="hero5"
            fill
            className="object-cover transition duration-700 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-neutral/70 via-neutral/20 to-transparent" />
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-6 text-left text-foreground"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-sm uppercase tracking-widest text-primary/90">
            our heritage
          </p>

          <p className="text-4xl font-black uppercase tracking-widest text-white font-playfair leading-tight md:text-6xl">
            A Century of Precision
          </p>

          <p className="max-w-2xl text-sm tracking-widest text-secondary/80 md:text-base">
            Since 1924, our master watchmakers have dedicated themselves to
            pushing the boundaries of mechanical horology. Each timepiece
            represents hundreds of hours of meticulous craftsmanship.
          </p>

          <Link
            href="/heritage"
            className="group cursor-pointer inline-flex items-center justify-center w-fit rounded-full border border-primary/25 bg-primary/10 px-8 py-3 text-sm uppercase tracking-widest text-primary transition duration-300 hover:border-primary/50 hover:bg-primary/20 hover:text-secondary focus:outline-none gap-2"
          >
            read our story
            <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero5;
