"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";
import Link from "next/link";

/** Last page of the story: an invitation to browse or come by the shop. */
const Hero4 = () => {
  return (
    <section className="bg-paper px-6 py-24 text-ink sm:px-10 md:py-32 xl:px-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-jost text-[11px] tracking-[0.3em] text-gold-deep">THE NEXT CHAPTER</p>
        <div className="mt-5">
          <RevealHeading lines={["Come and find", "your watch"]} align="center" className="text-4xl sm:text-6xl" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.9, 0.1, 1] }}
          className="mx-auto mt-8 max-w-xl font-jost text-base leading-relaxed text-ink/65 sm:text-lg"
        >
          Browse the collection online, or visit us in El Malla and try a few
          on. Either way, we&apos;ll help you find the one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.9, 0.1, 1] }}
          className="mt-12 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-10"
        >
          <Link
            href="/collections"
            className="group relative overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
            <span className="relative transition-colors group-hover:text-ink">View the collection</span>
          </Link>
          <Link href="/contact" className="group inline-flex items-center gap-3 font-jost text-sm tracking-[0.14em] text-ink">
            Visit the shop
            <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero4;
