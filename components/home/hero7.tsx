"use client";

import { motion } from "framer-motion";
import { CgArrowsExchange } from "react-icons/cg";
import { GoShieldCheck } from "react-icons/go";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { TbCreditCard } from "react-icons/tb";

const features = [
  {
    icon: <GoShieldCheck size={28} />,
    title: "100% Authentic",
    description:
      "Every watch is guaranteed genuine and sourced from trusted brands.",
  },
  {
    icon: <CgArrowsExchange size={28} />,
    title: "Easy Exchange",
    description: "Exchange your purchase in-store within 7 days.",
  },
  {
    icon: <PiPackage size={28} />,
    title: "Fast Delivery",
    description:
      "Delivery within 48 hours across Beirut and surrounding areas.",
  },
  {
    icon: <LuPhoneCall size={28} />,
    title: "After-Sales Support",
    description:
      "Dedicated WhatsApp support for any assistance after your purchase.",
  },
  {
    icon: <MdOutlineWorkspacePremium size={28} />,
    title: "Premium Brands",
    description:
      "Discover renowned international watch brands for every style.",
  },
  {
    icon: <TbCreditCard size={28} />,
    title: "Secure Checkout",
    description:
      "Order confidently with a simple and secure purchasing process.",
  },
];

const Hero7 = () => {
  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-24"
      style={{
        backgroundImage: "url(/bg-hero3.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-neutral/85" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-primary">
            Excellence in Every Detail
          </p>

          <p className="mt-3 font-playfair text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em] text-white">
            Why Choose Us
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-secondary/70 leading-relaxed">
            We combine authenticity, exceptional service, and carefully selected
            timepieces to provide a shopping experience you can trust.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur-md transition hover:border-primary/40"
            >
              {/* ICON */}
              <div className="mb-4 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary transition group-hover:scale-110">
                {feature.icon}
              </div>

              {/* TITLE */}
              <p className="font-playfair text-sm sm:text-lg uppercase tracking-wider text-white leading-snug">
                {feature.title}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm leading-relaxed text-secondary/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero7;
