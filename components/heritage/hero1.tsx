"use client";

import { motion } from "framer-motion";

const Hero1 = () => {
  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-light-neutral"
      style={{
        backgroundImage: "url(/heritage.jpeg)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ scale: 1.04 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-neutral/50"
        initial={{ opacity: 0.88 }}
        animate={{ opacity: 0.68 }}
        transition={{ duration: 1 }}
      />

      <div className="relative mx-auto flex min-h-screen items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm tracking-widest uppercase text-secondary md:text-base"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            our heritage
          </motion.p>

          <motion.p
            className="text-4xl font-black leading-tight tracking-wide text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] font-playfair md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Crafted With Purpose
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero1;
