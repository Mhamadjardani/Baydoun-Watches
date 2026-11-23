"use client";

import { MotionConfig } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_KEY = "scroll-positions";
const pageKey = () => window.location.pathname + window.location.search;

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * Weighted smooth scrolling (Lenis) driven by GSAP's ticker, so pinned,
 * scroll-scrubbed sections stay in step with the page. Off for visitors
 * who prefer reduced motion, as are framer-motion transforms (MotionConfig).
 *
 * Also remembers how far each page (path + query) was scrolled, and puts the
 * visitor back there when they return with the browser's Back/Forward buttons.
 * Smooth scrolling and pages that render their lists after loading defeat the
 * browser's own restore, so it is done here once the page is tall enough.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const returning = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, allowNestedScroll: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Remember the scroll position of the page being viewed.
  useEffect(() => {
    let timer: number | undefined;
    const save = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const positions = readPositions();
        positions[pageKey()] = Math.round(window.scrollY);
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions));
        } catch {
          // Storage full or blocked: scroll memory is a nicety, skip it.
        }
      }, 150);
    };
    const onPopState = () => {
      returning.current = true;
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("popstate", onPopState);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", save);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // A new page has a new height; pinned sections need fresh measurements.
  // Coming back with Back/Forward: return to where the visitor was.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    if (!returning.current) return () => clearTimeout(t);
    returning.current = false;

    const target = readPositions()[pageKey()];
    if (!target) return () => clearTimeout(t);

    // The list may still be loading: wait (up to ~2s) until the page is tall enough.
    let tries = 0;
    const restore = window.setInterval(() => {
      tries += 1;
      const reachable = document.documentElement.scrollHeight - window.innerHeight >= target;
      if (reachable || tries >= 20) {
        window.clearInterval(restore);
        if (lenisRef.current) lenisRef.current.scrollTo(target, { immediate: true, force: true });
        else window.scrollTo(0, target);
      }
    }, 100);

    return () => {
      clearTimeout(t);
      window.clearInterval(restore);
    };
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
