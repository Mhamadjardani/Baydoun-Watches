"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck, Store } from "lucide-react";

const features = [
  {
    title: "Only genuine pieces",
    description:
      "Every watch we sell is authentic and comes from brands we have trusted for years, so what you buy is exactly what it says on the dial.",
    icon: ShieldCheck,
  },
  {
    title: "Honest advice",
    description:
      "A first watch, a gift or an addition to a collection: we help you choose for your wrist, your style and your budget, never for the till.",
    icon: Store,
  },
  {
    title: "Here after the sale",
    description:
      "Exchange in store within 7 days, and reach us on WhatsApp whenever you need a hand with your watch after you take it home.",
    icon: MessageCircle,
  },
];

/** The shop's values, gold on black: the one dark chapter of the story. */
const Hero3 = () => {
  return (
    <section className="bg-ink px-6 py-24 text-paper sm:px-10 md:py-32 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center font-jost text-[11px] tracking-[0.3em] text-gold">WHAT WE STAND FOR</p>
        <div className="mt-5">
          <RevealHeading lines={["Three promises,", "kept since 1987"]} align="center" className="text-4xl text-paper sm:text-5xl" />
        </div>

        <ul className="mt-16 grid border-t border-gold/25 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: [0.2, 0.9, 0.1, 1] }}
                className="group border-b border-gold/25 px-2 py-12 sm:px-8 lg:[&:not(:last-child)]:border-r"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-700 group-hover:rotate-[360deg] group-hover:border-gold">
                  <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-7 font-serif text-3xl font-light sm:text-4xl">{feature.title}</h3>
                <p className="mt-4 max-w-sm font-jost text-sm leading-relaxed text-paper/60 sm:text-base">
                  {feature.description}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Hero3;
