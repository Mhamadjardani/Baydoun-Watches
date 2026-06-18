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
    icon: <GoShieldCheck size={34} />,
    title: "100% Authentic",
    description:
      "Every watch is guaranteed genuine and sourced from trusted brands.",
  },
  {
    icon: <CgArrowsExchange size={34} />,
    title: "Easy Exchange",
    description: "Exchange your purchase in-store within 7 days.",
  },
  {
    icon: <PiPackage size={34} />,
    title: "Fast Delivery",
    description:
      "Delivery within 48 hours across Beirut and surrounding areas.",
  },
  {
    icon: <LuPhoneCall size={34} />,
    title: "After-Sales Support",
    description:
      "Dedicated WhatsApp support for any assistance after your purchase.",
  },
  {
    icon: <MdOutlineWorkspacePremium size={34} />,
    title: "Premium Brands",
    description:
      "Discover renowned international watch brands for every style.",
  },
  {
    icon: <TbCreditCard size={34} />,
    title: "Secure Checkout",
    description:
      "Order confidently with a simple and secure purchasing process.",
  },
];

const Hero7 = () => {
  return (
    <section
      className="relative overflow-hidden bg-background py-24"
      style={{
        backgroundImage: "url(/bg-hero3.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-neutral/85" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >

          <p className="text-xs uppercase tracking-[0.45em] text-primary">
            Excellence in Every Detail
          </p>

          <p className="mt-4 font-playfair text-4xl uppercase tracking-[0.15em] text-white md:text-6xl">
            Why Choose Us
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-secondary/70">
            We combine authenticity, exceptional service, and carefully selected
            timepieces to provide a shopping experience you can trust.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl border border-white/10 bg-white/4 p-8 backdrop-blur-md transition hover:border-primary/40"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary transition group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="font-playfair text-xl uppercase tracking-wider text-white">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-secondary/70">
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
