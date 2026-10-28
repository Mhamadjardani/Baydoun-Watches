"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";
import { CgArrowsExchange } from "react-icons/cg";
import { GoShieldCheck } from "react-icons/go";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { TbCreditCard } from "react-icons/tb";

const PROMISES = [
  { icon: GoShieldCheck, title: "100% authentic", copy: "Every watch is guaranteed genuine and sourced from trusted brands." },
  { icon: CgArrowsExchange, title: "Easy exchange", copy: "Exchange your purchase in store within 7 days." },
  { icon: PiPackage, title: "Fast delivery", copy: "Delivery anywhere in Lebanon, within 48 hours in Beirut and surrounding areas." },
  { icon: LuPhoneCall, title: "After-sales support", copy: "Dedicated WhatsApp support for any help after your purchase." },
  { icon: MdOutlineWorkspacePremium, title: "Premium brands", copy: "Renowned international watch brands for every style." },
  { icon: TbCreditCard, title: "Simple checkout", copy: "Order confidently with a simple, secure purchasing process." },
];

/** Gold on black, the logo's other classic pairing, for the shop's promises. */
const Promises = () => (
  <section className="bg-ink px-6 py-24 text-paper sm:px-10 md:py-32">
    <div className="mx-auto max-w-7xl">
      <RevealHeading lines={["Why Lebanon buys", "its watches here"]} align="center" className="text-4xl text-paper sm:text-5xl" />
      <ul className="mt-16 grid border-t border-gold/25 sm:grid-cols-2 lg:grid-cols-3">
        {PROMISES.map(({ icon: Icon, title, copy }, i) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.2, 0.9, 0.1, 1] }}
            className="group border-b border-gold/25 px-2 py-10 sm:px-8 lg:[&:not(:nth-child(3n))]:border-r sm:max-lg:[&:nth-child(odd)]:border-r"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-700 group-hover:rotate-[360deg] group-hover:border-gold">
              <Icon size={24} aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-serif text-3xl font-light">{title}</h3>
            <p className="mt-3 max-w-xs font-jost text-sm leading-relaxed text-paper/60">{copy}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default Promises;
