"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BRANDS = [
  { label: "Casio", href: "/collections?brand=casio" },
  { label: "Tommy Hilfiger", href: "/collections?brand=tommyHilfiger" },
  { label: "Calvin Klein", href: "/collections?brand=calvinKlein" },
  { label: "Lacoste", href: "/collections?brand=lacoste" },
  { label: "Omorfia", href: "/collections?brand=omorfia" },
  { label: "Rovina", href: "/collections?brand=rovina" },
];

const LINES = [
  { label: "G-Shock", href: "/collections?brand=casio&subCategory=g-shock" },
  { label: "Edifice", href: "/collections?brand=casio&subCategory=edifice" },
  { label: "Vintage", href: "/collections?brand=casio&subCategory=vintage" },
  { label: "Baby-G", href: "/collections?brand=casio&subCategory=baby-g" },
  { label: "Pro Trek", href: "/collections?brand=casio&subCategory=pro-trek" },
  { label: "Omorfia Club", href: "/collections?brand=omorfia&subCategory=omorfia-club" },
];

function Row({ items, reverse, size }: { items: typeof BRANDS; reverse?: boolean; size: string }) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="flex w-max" data-row={reverse ? "reverse" : "forward"}>
      {loop.map((item, i) => (
        <Link
          key={`${item.label}-${i}`}
          href={item.href}
          tabIndex={i < items.length ? 0 : -1}
          aria-hidden={i >= items.length}
          className={`group flex items-center whitespace-nowrap font-serif font-light ${size}`}
        >
          <span className="px-8 transition-colors duration-500 group-hover:text-gold-deep">{item.label}</span>
          <svg viewBox="0 0 24 24" className="h-[0.32em] w-[0.32em] text-gold" aria-hidden="true">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
          </svg>
        </Link>
      ))}
    </div>
  );
}

/**
 * The houses and lines we carry, gliding past in two directions. Scrolling
 * speeds them up and leans them with your speed; hovering one turns it gold.
 */
const BrandMarquee = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const forward = gsap.to("[data-row='forward']", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        const reverse = gsap.fromTo("[data-row='reverse']", { xPercent: -50 }, { xPercent: 0, duration: 46, ease: "none", repeat: -1 });
        const lean = gsap.quickTo("[data-row]", "skewX", { duration: 0.5, ease: "power3.out" });
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const boost = 1 + Math.min(Math.abs(v) / 300, 6);
            gsap.to([forward, reverse], { timeScale: boost, duration: 0.2, overwrite: true });
            gsap.to([forward, reverse], { timeScale: 1, duration: 1.2, delay: 0.2, overwrite: false });
            lean(gsap.utils.clamp(-10, 10, v / -200));
          },
          onLeave: () => lean(0),
          onLeaveBack: () => lean(0),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Brands and lines" className="overflow-hidden border-y border-gold/25 bg-paper py-12 text-ink sm:py-16">
      <Row items={BRANDS} size="text-3xl sm:text-5xl" />
      <div className="mt-4 text-ink/45">
        <Row items={LINES} reverse size="text-xl italic sm:text-3xl" />
      </div>
    </section>
  );
};

export default BrandMarquee;
