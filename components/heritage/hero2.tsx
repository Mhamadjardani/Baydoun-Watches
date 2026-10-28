"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FACTS = [
  { value: "1987", label: "WHERE IT BEGAN" },
  { value: "Six brands", label: "UNDER ONE ROOF" },
  { value: "Authentic", label: "EVERY SINGLE PIECE" },
];

/** The shop's story beside an arched photo that opens and drifts on scroll. */
const Hero2 = () => {
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
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: { trigger: "[data-arch]", start: "top 80%" },
          },
        );
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -8, scale: 1.15 },
          {
            yPercent: 8,
            scale: 1.15,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-[#f7f6f2] px-6 py-24 text-ink sm:px-10 md:py-32 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div className="relative mx-auto w-full max-w-md rounded-t-full border border-gold/40 p-3 md:order-last">
            <div data-arch className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#f6f5f1]">
              <div data-parallax className="absolute inset-0">
                <Image
                  src="/hero5.jpeg"
                  alt="Omorfia chronograph with a blue dial"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="font-jost text-[11px] tracking-[0.3em] text-gold-deep">THE SHOP</p>
            <div className="mt-5">
              <RevealHeading lines={["A Beirut address", "since 1987"]} className="text-4xl sm:text-5xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.9, 0.1, 1] }}
              className="mt-8 max-w-lg space-y-5 font-jost leading-relaxed text-ink/70"
            >
              <p>
                Since 1987, Baydoun Watches has been at the centre of Beirut,
                offering a curated selection of quality watches, bracelets and
                wallets. Our experience has made us a trusted address for
                first-time buyers and long-time collectors alike.
              </p>
              <p>
                We keep it simple: genuine pieces from brands we know well,
                honest advice at the counter, and the kind of service that
                brings people back for their next watch, and their
                children&apos;s first.
              </p>
            </motion.div>

            <ul className="mt-12 grid grid-cols-3 border-t border-gold/25">
              {FACTS.map((fact, i) => (
                <motion.li
                  key={fact.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.2, 0.9, 0.1, 1] }}
                  className={`pt-6 ${i > 0 ? "border-l border-gold/25 pl-3 sm:pl-6" : "pr-3"}`}
                >
                  <p className="font-serif text-2xl font-light leading-tight sm:text-4xl">{fact.value}</p>
                  <p className="mt-2 font-jost text-[10px] tracking-[0.2em] text-gold-deep sm:text-[11px] sm:tracking-[0.3em]">
                    {fact.label}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.2, 0.9, 0.1, 1] }}
          className="mx-auto mt-24 max-w-3xl text-center md:mt-32"
        >
          <span className="block font-serif text-7xl font-light leading-none text-gold" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="-mt-4 font-serif text-3xl font-light italic leading-snug sm:text-4xl">
            A good watch should feel like it was always yours. Our job is to
            help you find that one.
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-4 font-jost text-[11px] tracking-[0.3em] text-gold-deep">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            BAYDOUN WATCHES · EST. 1987
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default Hero2;
