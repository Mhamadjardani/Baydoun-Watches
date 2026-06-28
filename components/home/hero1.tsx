"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

// 1. Define the structural content for each individual slide
const slides = [
  {
    image: "/rovina.png",
    title: "Rovina",
    description:
      "A symphony of precision engineering and uncompromising craftsmanship. Discover horology elevated to high art.",
    primaryBtn: {
      text: "explore the collection",
      href: "/collections?brand=rovina",
    },
    // secondaryBtn: { text: "discover more", href: "/categories" },
  },
  {
    image: "/dkny.png",
    title: "DKNY",
    description:
      "Capture the energy and spirit of New York. Bold, modern timepieces designed for the fast-paced contemporary lifestyle.",
    primaryBtn: {
      text: "view new arrivals",
      href: "/collections?brand=dkny",
    },
    // secondaryBtn: { text: "our story", href: "/about" },
  },
  {
    image: "/ck.png",
    title: "Calvin Klein",
    description:
      "Minimalist aesthetics meets modern sophistication. Elevate your daily look with clean lines and understated luxury.",
    primaryBtn: {
      text: "shop minimalist styles",
      href: "/collections?brand=calvinKlein",
    },
    // secondaryBtn: { text: "book appointment", href: "/contact" },
  },
  {
    image: "/th.png",
    title: "Tommy Hilfiger",
    description:
      "Classic American cool with a fresh, modern twist. Vibrant designs crafted for an effortlessly stylish, preppy edge.",
    primaryBtn: {
      text: "shop iconic looks",
      href: "/collections?brand=tommyHilfiger",
    },
    // secondaryBtn: { text: "book appointment", href: "/contact" },
  },
];

const features = [
  "Complimentary Worldwide Shipping",
  "Free Returns & Exchanges",
  "1-Year International Warranty",
  "100% Certified Authenticity",
  "24/7 Dedicated Support",
];

const Hero1 = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // 2. Cycle through slides every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[currentIdx];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* 3. Sliding Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIdx}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentSlide.image})`,
              backgroundAttachment: "fixed",
            }}
          />
        </AnimatePresence>
      </div>

      {/* 4. Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0.88 }}
        animate={{ opacity: 0.58 }}
        transition={{ duration: 1 }}
      />

      {/* Dynamic Content Container */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24 text-left sm:px-10 md:px-16">
        {/* AnimatePresence wrapping the text allows content to fade out and in nicely during transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIdx}`}
            className="max-w-3xl space-y-10 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.p className="text-4xl font-black uppercase tracking-[0.35em] leading-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] font-playfair md:text-6xl">
              {currentSlide.title}
            </motion.p>

            <motion.p className="max-w-xl text-sm tracking-widest text-secondary md:text-base">
              {currentSlide.description}
            </motion.p>

            <div className="mt-10 flex gap-4 flex-row sm:items-center">
              <Link
                href={currentSlide.primaryBtn.href}
                className="cursor-pointer inline-flex items-center justify-center rounded-full bg-primary px-4 sm:px-8 py-3 text-xs sm:text-sm uppercase font-black text-background transition duration-300 hover:bg-primary/95"
              >
                {currentSlide.primaryBtn.text}
              </Link>
              {/* <Link
                href={currentSlide.secondaryBtn.href}
                className="cursor-pointer inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-4 sm:px-8 py-3 text-xs sm:text-sm uppercase font-black text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/10"
              >
                {currentSlide.secondaryBtn.text}
              </Link> */}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ticker Footer */}
      <motion.div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 bg-neutral/90 py-4">
        <motion.div
          className="flex min-w-[200%] items-center gap-8 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="shrink-0 text-[0.50rem] sm:text-[0.90rem] tracking-wide uppercase text-primary"
            >
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero1;
