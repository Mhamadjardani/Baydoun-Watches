"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The heritage story beside an arched photo that drifts slowly as you scroll. */
const HeritageArch = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
        gsap.fromTo(
          "[data-arch]",
          { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)",
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 75%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-[#f7f6f2] px-6 py-24 text-ink sm:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="relative mx-auto w-full max-w-md rounded-t-full border border-gold/40 p-3">
          <div data-arch className="relative aspect-[3/4] overflow-hidden rounded-t-full">
            <div data-parallax className="absolute inset-0">
              <Image src="/hero5.jpeg" alt="Omorfia chronograph with a blue dial" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div>
          <p className="font-jost text-xs tracking-[0.35em] text-gold-deep">OUR HERITAGE</p>
          <div className="mt-5">
            <RevealHeading lines={["A trusted name", "in fine watches"]} className="text-4xl sm:text-5xl" />
          </div>
          <p className="mt-8 max-w-lg font-jost leading-relaxed text-ink/70">
            Since 1987, Baydoun Watches has offered a curated selection of high-quality watches, bracelets
            and wallets, with honest advice for first-time buyers and collectors alike, and delivery to
            every corner of Lebanon.
          </p>
          <Link
            href="/heritage"
            className="group relative mt-10 inline-flex overflow-hidden rounded-full border border-ink px-8 py-3.5 font-jost text-sm tracking-[0.14em]"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
            <span className="relative transition-colors group-hover:text-paper">Read our story</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeritageArch;
