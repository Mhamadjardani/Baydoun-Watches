"use client";

import { useShowcase, useShowcaseReady } from "@/components/home/ShowcasePool";
import { useSwipe } from "@/components/motion/useSwipe";
import WatchImage from "@/components/showroom/WatchImage";
import { prepareCutout } from "@/lib/cutout";
import { LAUNCH_PROMO, launchPromoActive } from "@/lib/promo";
import { BRAND_LABELS, formatPrice } from "@/lib/showcase";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// three.js only loads in the browser, after the headline has painted.
const StageScene = dynamic(() => import("./StageScene"), { ssr: false });

const ease = [0.2, 0.9, 0.1, 1] as const;
const SLIDE_MS = 4800;

/**
 * Opening of the home page, "The Spotlight": real catalogue watches take turns
 * on a turning 3D pedestal in a beam of gold dust. Each one swings in on top
 * of the light (true colours, no blending) and its price tag links to it.
 */
const HeroSpotlight = () => {
  const watches = useShowcase("hero");
  const ready = useShowcaseReady();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const count = watches.length;
  const current = count ? watches[index % count] : null;

  const go = useCallback(
    (step: number) => {
      if (!count) return;
      setDirection(step);
      setIndex((i) => (i + step + count) % count);
    },
    [count],
  );

  // Auto-advance; the progress bar is keyed to the same timer.
  useEffect(() => {
    if (!ready || paused || count < 2) return;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [ready, paused, count, index, go]);

  // Cut out the next photo ahead of time so it is ready when it takes the stage.
  useEffect(() => {
    if (!count) return;
    prepareCutout(watches[(index + 1) % count].image);
  }, [index, count, watches]);

  // Swipe (or drag) the stage to change watch.
  const { style: swipeStyle, ...swipe } = useSwipe(go);

  // The watch leans toward the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-14, 14]), { stiffness: 80, damping: 14 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 80, damping: 14 });

  // Scroll: the stage drifts back as the page moves on.
  useEffect(() => {
    const onScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || !stageRef.current) return;
      const p = Math.min(1, Math.max(0, -rect.top / rect.height));
      stageRef.current.style.transform = `translateY(${p * 80}px) scale(${1 - p * 0.08})`;
      stageRef.current.style.opacity = String(1 - p * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brand = current ? BRAND_LABELS[current.brand] : "";

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-paper text-ink"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        px.set((e.clientX / window.innerWidth) * 2 - 1);
        py.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <div className="mx-auto grid min-h-[100svh] max-w-[1500px] grid-rows-[auto_1fr] gap-2 px-6 pb-10 pt-24 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-1 lg:items-center lg:gap-6 lg:pb-0 lg:pt-20 xl:px-16">
        {/* ── Headline ─────────────────────────────────────────── */}
        <div className="relative z-20 order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.6, ease }}
            className="font-jost text-[11px] text-gold-deep sm:text-xs"
          >
            SINCE 1987 · DELIVERED ACROSS LEBANON
          </motion.p>
          {launchPromoActive && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="mt-4 flex w-fit items-center gap-3 rounded-full border border-gold bg-gold/10 py-1.5 pl-1.5 pr-4 font-jost text-xs tracking-[0.14em] text-ink"
            >
              <span className="rounded-full bg-gold px-3 py-1 font-medium text-ink">-{LAUNCH_PROMO.percent}%</span>
              {LAUNCH_PROMO.label.toUpperCase()} · ON EVERY WATCH
            </motion.p>
          )}
          <h1 className="mt-5 font-serif font-light leading-[0.92] text-[clamp(2.8rem,6vw,6.25rem)]">
            {["Wear", "the moment."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.07em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.16, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.span
            aria-hidden="true"
            className="mt-7 block h-px w-24 origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.8, ease }}
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.9, ease }}
            className="mt-7 max-w-md font-jost text-base leading-relaxed text-ink/65 sm:text-lg"
          >
            Iconic watches from Casio, Tommy Hilfiger, Calvin Klein, Lacoste, Omorfia and Rovina,
            chosen with care since 1987 and delivered to your door anywhere in Lebanon.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.1, ease }}
            className="mt-9 flex flex-wrap items-center gap-5 font-jost"
          >
            <Link href="/collections" className="group relative overflow-hidden rounded-full bg-ink px-8 py-4 text-sm tracking-[0.14em] text-paper">
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors group-hover:text-ink">Discover the collection</span>
            </Link>
            <Link href="/collections" className="group inline-flex items-center gap-3 py-4 text-sm tracking-[0.14em] text-ink">
              New arrivals
              <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* ── The stage ────────────────────────────────────────── */}
        <div
          ref={stageRef}
          className="relative order-1 h-[52svh] min-h-[340px] origin-bottom will-change-transform lg:order-2 lg:h-[86svh]"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          {...swipe}
          style={{ ...swipeStyle, ["--plinth-y" as string]: "70%", ["--plinth-w" as string]: "240px" }}
        >
          {/* Warm spotlight from above */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_32%_60%_at_50%_42%,rgba(212,171,98,0.22),rgba(255,255,255,0)_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[75%] w-[46%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(212,171,98,0.18),rgba(212,171,98,0))] [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]"
          />


          {ready && <StageScene stageRef={stageRef} pulse={index} />}

          {/* The watch, standing on the pedestal, above the light and the gold dust */}
          <div className="absolute inset-x-0 top-0 z-10" style={{ height: "var(--plinth-y)", perspective: 1100 }}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {current && (
                <motion.div
                  key={current.href}
                  custom={direction}
                  className="absolute bottom-0 left-1/2 h-[78%] w-[min(80%,460px)] -translate-x-1/2"
                  initial={{ opacity: 0, rotateY: 80 * direction, x: 60 * direction, filter: "blur(8px)" }}
                  animate={{ opacity: 1, rotateY: 0, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, rotateY: -80 * direction, x: -60 * direction, filter: "blur(8px)" }}
                  transition={{ duration: 0.9, ease }}
                >
                  <motion.div className="h-full w-full" style={{ rotateX, rotateY }}>
                    <motion.div
                      className="h-full w-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Link href={current.href} aria-label={`View ${current.title}`} className="block h-full w-full">
                        <WatchImage
                          src={current.image}
                          alt={current.title}
                          loading="eager"
                          whileLoading="hide"
                          className="h-full w-full object-contain object-bottom"
                        />
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price tag */}
          <div className="absolute bottom-0 right-0 z-20 w-full sm:bottom-6 sm:w-[min(100%,330px)]">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease }}
                  className="rounded-2xl border border-gold/35 bg-paper/90 px-5 py-4 font-jost shadow-[0_24px_50px_-28px_rgba(28,26,23,0.4)] backdrop-blur max-sm:hidden"
                >
                  <p className="text-[11px] tracking-[0.2em] text-gold-deep">{brand.toUpperCase()}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-ink/80">{current.title}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl text-ink">{formatPrice(current.price)}</span>
                      {current.originalPrice && (
                        <span className="text-xs text-ink/40 line-through">{formatPrice(current.originalPrice)}</span>
                      )}
                    </p>
                    <Link href={current.href} className="group inline-flex items-center gap-2 text-xs tracking-[0.16em] text-ink">
                      VIEW
                      <span className="h-px w-5 bg-gold transition-all duration-300 group-hover:w-9" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Controls and the timer for the next watch */}
            <div className="mt-3 flex items-center gap-3 font-jost">
              <button type="button" onClick={() => go(-1)} aria-label="Previous watch" className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-gold hover:text-gold-deep">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next watch" className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-gold hover:text-gold-deep">
                <ChevronRight size={18} />
              </button>
              {/* Phones: the price card would cover the pedestal, so brand and price sit here */}
              {current && (
                <Link href={current.href} className="flex min-w-0 items-baseline gap-2 sm:hidden">
                  <span className="truncate text-[11px] tracking-[0.18em] text-gold-deep">{brand.toUpperCase()}</span>
                  <span className="font-serif text-xl text-ink">{formatPrice(current.price)}</span>
                </Link>
              )}
              <span className="relative h-px flex-1 bg-ink/10">
                <motion.span
                  key={`${index}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? "0%" : "100%" }}
                  transition={{ duration: paused ? 0.3 : SLIDE_MS / 1000, ease: "linear" }}
                />
              </span>
              <span className="text-xs tabular-nums text-ink/50">
                {String((index % Math.max(count, 1)) + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSpotlight;
