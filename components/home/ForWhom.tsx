"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PANELS = [
  {
    title: "For him",
    copy: "Classic and contemporary timepieces made for confidence and everyday elegance.",
    image: "/him.webp",
    href: "/collections?gender=Men",
  },
  {
    title: "For her",
    copy: "Graceful watches to complement every outfit and every occasion.",
    image: "/her.webp",
    href: "/collections?gender=Women",
  },
  {
    title: "For the little ones",
    copy: "Fun, durable and bright, built to keep up with their biggest adventures.",
    image: "/kids.webp",
    href: "/collections?gender=Kids",
  },
];

/**
 * Three arched windows, the shape of a classic watch case, one per wrist.
 * Each arch opens like a curtain, and its photo drifts inside it as you scroll.
 */
const ForWhom = () => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-arch]").forEach((arch, i) => {
          gsap.fromTo(
            arch,
            { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)",
              duration: 1.5,
              delay: i * 0.15,
              ease: "power3.inOut",
              scrollTrigger: { trigger: arch, start: "top 85%" },
            },
          );
          gsap.fromTo(
            arch.querySelector("[data-drift]"),
            { yPercent: -10 },
            { yPercent: 10, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
  <section ref={ref} className="bg-paper px-6 py-24 text-ink sm:px-10 md:py-32">
    <div className="mx-auto max-w-7xl">
      <RevealHeading lines={["A watch for", "every wrist"]} align="center" className="text-4xl sm:text-6xl" />
      <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {PANELS.map((panel, i) => (
          <motion.li
            key={panel.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1, delay: i * 0.12, ease: [0.2, 0.9, 0.1, 1] }}
          >
            <Link href={panel.href} className="group block text-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-gold/30 p-2 transition-colors duration-500 group-hover:border-gold">
                <div data-arch className="relative h-full w-full overflow-hidden rounded-t-full">
                  <div data-drift className="absolute inset-[-12%_0]">
                  <Image
                    src={panel.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:scale-110"
                  />
                  </div>
                </div>
              </div>
              <h3 className="mt-7 font-serif text-4xl font-light">{panel.title}</h3>
              <p className="mx-auto mt-3 max-w-xs font-jost text-sm leading-relaxed text-ink/60">{panel.copy}</p>
              <span className="mt-5 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-gold-deep">
                Explore
                <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-12" aria-hidden="true" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
  );
};

export default ForWhom;
