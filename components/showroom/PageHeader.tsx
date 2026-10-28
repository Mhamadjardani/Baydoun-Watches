"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";

/**
 * Opening of every inner page: a small gold eyebrow, a serif title that rises
 * from behind a mask, a short caption, and an optional slot on the right.
 */
export default function PageHeader({
  eyebrow,
  title,
  caption,
  aside,
}: {
  eyebrow: string;
  title: string[];
  caption?: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-8 border-b border-gold/25 pb-10">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.7em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.2, ease: [0.2, 0.9, 0.1, 1] }}
          className="font-jost text-[11px] text-gold-deep sm:text-xs"
        >
          {eyebrow.toUpperCase()}
        </motion.p>
        <div className="mt-4">
          <RevealHeading as="h1" lines={title} className="text-5xl sm:text-7xl" />
        </div>
        {caption && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.2, 0.9, 0.1, 1] }}
            className="mt-6 max-w-xl font-jost text-base leading-relaxed text-ink/60"
          >
            {caption}
          </motion.p>
        )}
      </div>
      {aside}
    </header>
  );
}
