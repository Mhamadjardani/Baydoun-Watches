"use client";

import { motion } from "framer-motion";

const features = [
  "Complimentary Worldwide Shipping",
  "Free Returns & Exchanges",
  "1-Year International Warranty",
  "100% Certified Authenticity",
  "24/7 Dedicated Support",
];

const Hero1 = () => {
  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage: "url(/home_premium.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ scale: 1.04 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-neutral"
        initial={{ opacity: 0.88 }}
        animate={{ opacity: 0.58 }}
        transition={{ duration: 1 }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24 text-left sm:px-10 md:px-16">
        <motion.div
          className="max-w-3xl space-y-10 text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.p
            className="text-4xl font-black uppercase tracking-[0.35em] leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] font-playfair md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            time, perfected
          </motion.p>

          <motion.p
            className="max-w-xl text-sm tracking-widest text-secondary md:text-base"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            A symphony of precision engineering and uncompromising craftsmanship.
            Discover horology elevated to high art
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4 flex-row sm:items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
          >
            <button className="cursor-pointer inline-flex items-center justify-center rounded-full bg-primary px-0.5 sm:px-8 py-3 text-xs sm:text-sm uppercase tracking-widest sm:tracking-[0.35em] text-background transition duration-300 hover:bg-primary/95">
              explore the collection
            </button>
            <button className="cursor-pointer inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-0.5 sm:px-8 py-3 text-xs sm:text-sm uppercase tracking-widest sm:tracking-[0.35em] text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/10">
              discover more
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 bg-neutral/90 py-4">
        <motion.div
          className="flex min-w-[200%] items-center gap-8 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="shrink-0 text-[0.50rem] sm:text-[0.68rem] uppercase tracking-[0.35em] text-primary"
            >
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero1;
