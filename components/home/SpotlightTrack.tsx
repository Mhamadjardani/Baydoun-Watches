"use client";

import { useShowcase } from "@/components/home/ShowcasePool";
import RevealHeading from "@/components/motion/RevealHeading";
import { BRAND_LABELS, formatPrice } from "@/lib/showcase";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "In the spotlight": vertical scroll walks you sideways past a row of watches
 * on plinths. The one in the middle of the screen steps forward into a gold
 * pool of light. Phones get a native swipe row with the same light.
 */
const SpotlightTrack = () => {
  const watches = useShowcase("spotlight");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      // Light the card nearest the centre of the screen
      const focus = () => {
        const mid = window.innerWidth / 2;
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid) / (window.innerWidth * 0.5);
          card.style.setProperty("--focus", String(Math.max(0, 1 - d)));
        }
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          // Runs on every frame the track moves, including the scrub catch-up after scrolling stops
          onUpdate: focus,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            refreshPriority: 1, // rebuilt after the visit's shuffle; refresh before later sections
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        focus();
      });
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        const row = track();
        const onScroll = () => focus();
        row?.addEventListener("scroll", onScroll, { passive: true });
        focus();
        return () => row?.removeEventListener("scroll", onScroll);
      });
      function track() {
        return sectionRef.current?.querySelector<HTMLElement>("[data-row]") ?? null;
      }
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [watches.map((w) => w.href).join("|")], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-paper text-ink">
      <div className="flex min-h-[100svh] flex-col justify-center py-20 md:pb-8 md:pt-24">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-end justify-between gap-6 px-6 sm:px-10 xl:px-16">
          <RevealHeading lines={["In the spotlight"]} className="text-5xl sm:text-7xl" />
          <p className="max-w-xs font-jost text-ink/60">New arrivals and favourites from every brand, picked fresh on every visit.</p>
        </div>

        <div data-row className="no-scrollbar mt-10 snap-x snap-mandatory overflow-x-auto md:snap-none md:overflow-visible">
          <div ref={trackRef} className="flex w-max gap-6 px-6 sm:px-10 md:gap-10 xl:px-16">
            {watches.map((watch) => (
              <Link
                key={watch.href}
                href={watch.href}
                data-card
                style={{ ["--focus" as string]: 0 }}
                className="group relative flex w-[72vw] shrink-0 snap-center flex-col sm:w-[44vw] md:w-[28vw] lg:w-[21vw]"
              >
                <div className="relative aspect-[4/5]">
                  {/* Pool of light under the watch, brightest for the centred card */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_62%_50%_at_50%_58%,rgba(212,171,98,0.5),rgba(255,255,255,0)_72%)] transition-opacity duration-300"
                    style={{ opacity: "var(--focus)" }}
                  />
                  {/* Gold floor ring the centred watch stands on */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[16%] bottom-[7%] h-7 rounded-[50%] border border-gold"
                    style={{ opacity: "var(--focus)", transform: "scale(calc(0.7 + var(--focus) * 0.3))" }}
                  />
                  <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[8%] h-3 rounded-[50%] bg-ink/10 blur-md" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watch.image}
                    alt={watch.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply brightness-[1.04] contrast-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:-translate-y-3 group-hover:rotate-[-4deg]"
                    style={{ transform: "translateY(calc(var(--focus) * -14px)) scale(calc(0.9 + var(--focus) * 0.14))" }}
                  />
                  {watch.badge && (
                    <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-paper px-3 py-1 font-jost text-[11px] tracking-[0.12em] text-gold-deep">
                      {watch.badge}
                    </span>
                  )}
                </div>
                <div className="mt-2 px-2 font-jost">
                  <p className="text-xs tracking-[0.18em] text-gold-deep">{BRAND_LABELS[watch.brand].toUpperCase()}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-ink/75">{watch.title}</p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="font-serif text-2xl">{formatPrice(watch.price)}</span>
                    {watch.originalPrice && <span className="text-xs text-ink/40 line-through">{formatPrice(watch.originalPrice)}</span>}
                  </p>
                </div>
              </Link>
            ))}
            {/* Closing card */}
            <Link
              href="/collections"
              className="group flex w-[72vw] shrink-0 snap-center flex-col items-center justify-center rounded-[2rem] border border-gold/40 sm:w-[44vw] md:w-[28vw] lg:w-[21vw]"
            >
              <span className="font-serif text-4xl font-light">See every watch</span>
              <span className="mt-4 h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-[1500px] px-16 md:block" aria-hidden="true">
          <div className="h-px bg-gold/20">
            <span ref={barRef} className="block h-px origin-left scale-x-0 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightTrack;
