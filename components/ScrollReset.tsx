"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const reset = () => {
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("pointer-events");
      document.body.removeAttribute("data-scroll-locked");
    };

    reset();
    const frame = window.requestAnimationFrame(reset);
    window.addEventListener("pageshow", reset);
    window.addEventListener("popstate", reset);
    window.addEventListener("focus", reset);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("popstate", reset);
      window.removeEventListener("focus", reset);
    };
  }, [pathname]);

  return null;
}
