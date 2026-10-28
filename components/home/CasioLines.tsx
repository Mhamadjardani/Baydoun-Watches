"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export type CasioLine = {
  key: string;
  name: string;
  count: number;
  /** In-stock pieces from this line; one is shown at random each visit. */
  options: { image: string; title: string }[];
};

function LineCard({ line, index, wide }: { line: CasioLine; index: number; wide: boolean }) {
  const [failed, setFailed] = useState(false);
  const [pick, setPick] = useState(line.options[0]);
  useEffect(() => {
    const t = setTimeout(() => setPick(line.options[Math.floor(Math.random() * line.options.length)]), 0);
    return () => clearTimeout(t);
  }, [line.options]);
  return (
    <motion.li
      className={wide ? "lg:col-span-2" : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.08, ease: [0.2, 0.9, 0.1, 1] }}
    >
      <Link
        href={`/collections?brand=casio&subCategory=${encodeURIComponent(line.key)}`}
        className="group relative block overflow-hidden rounded-[1.25rem] border border-gold/20 bg-paper p-6 transition-colors duration-500 hover:border-gold"
      >
        <div className="flex items-baseline justify-between gap-3 font-jost">
          <span className="font-serif text-3xl text-ink">{line.name}</span>
          <span className="text-xs text-ink/45">{line.count} pieces</span>
        </div>
        <div className="relative mt-4 h-56 sm:h-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={failed ? "/baydoun-logo.webp" : pick.image}
            alt={pick.title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain mix-blend-multiply brightness-[1.04] contrast-[1.05] transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:rotate-[8deg] group-hover:scale-110"
          />
        </div>
        <span className="mt-4 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-gold-deep">
          Shop {line.name}
          <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-12" aria-hidden="true" />
        </span>
      </Link>
    </motion.li>
  );
}

/** Casio is most of the catalogue, so each of its lines gets a door of its own. */
const CasioLines = ({ lines, total }: { lines: CasioLine[]; total: number }) => (
  <section className="bg-[#f7f6f2] px-6 py-24 text-ink sm:px-10 md:py-32">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <RevealHeading lines={["The world", "of Casio"]} className="text-5xl sm:text-7xl" />
        <p className="max-w-sm font-jost text-ink/60">
          {total} Casio watches, from the vintage A158 to the toughest G-Shock. Choose a line to start.
        </p>
      </div>
      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lines.map((line, i) => (
          // The last card widens to close a gap in the final row of four.
          <LineCard key={line.key} line={line} index={i} wide={i === lines.length - 1 && lines.length % 4 === 3} />
        ))}
      </ul>
    </div>
  </section>
);

export default CasioLines;
