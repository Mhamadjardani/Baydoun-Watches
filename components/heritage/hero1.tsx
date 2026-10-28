"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Opening of the story: the shop's name beside an arch that opens on load. */
const Hero1 = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-arch]",
          { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)",
            duration: 1.8,
            delay: 0.2,
            ease: "power3.inOut",
          },
        );
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -6, scale: 1.15 },
          {
            yPercent: 10,
            scale: 1.15,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 md:pb-32 xl:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.7em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, ease: [0.2, 0.9, 0.1, 1] }}
            className="font-jost text-[11px] text-gold-deep sm:text-xs"
          >
            OUR STORY · EST. 1987
          </motion.p>
          <div className="mt-5">
            <RevealHeading as="h1" lines={["Baydoun", "Watches"]} className="text-5xl sm:text-7xl" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.9, 0.1, 1] }}
            className="mt-8 max-w-md font-jost text-base leading-relaxed text-ink/65 sm:text-lg"
          >
            A watch shop since 1987, delivering across Lebanon. This is a short
            story about the place, the people behind the counter, and the
            promise we make with every watch.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center gap-4 font-jost text-xs tracking-[0.3em] text-ink/50"
            aria-hidden="true"
          >
            <span className="relative block h-12 w-px overflow-hidden bg-gold/25">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-gold"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            SCROLL
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-md rounded-t-full border border-gold/40 p-3">
          <div data-arch className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#f6f5f1]">
            <div data-parallax className="absolute inset-0">
              <Image
                src="/heritage.jpeg"
                alt="A two-tone chronograph on a watchmaker's bench"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-[62%_center]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
