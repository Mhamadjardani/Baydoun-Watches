"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero3 = () => {
  const router = useRouter();
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage: "url(/bg-hero3.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-neutral/90"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.56 }}
        transition={{ duration: 1 }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10 md:px-16">
        <motion.div
          className="max-w-4xl space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.p
            className="text-4xl uppercase tracking-widest leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] font-playfair md:text-6xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Crafted for Those Who Value Time
          </motion.p>

          <motion.p
            className="mx-auto max-w-2xl text-sm tracking-widest text-secondary md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.12 }}
          >
            Experience the intersection of traditional watchmaking and modern
            innovation. Every component finished to the highest standards of
            Haute Horlogerie
          </motion.p>

          {/* <motion.button
            type="button"
            className="mx-auto group cursor-pointer inline-flex items-center justify-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-8 py-3 text-sm uppercase tracking-widest text-primary transition duration-300 hover:border-primary/50 hover:bg-primary/15 focus:outline-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
            onClick={() => {
              router.push("/heritage");
            }}
          >
            explore heritage
            <span className="inline-block h-px w-10 bg-primary transition-all duration-300 group-hover:w-16" />
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero3;
