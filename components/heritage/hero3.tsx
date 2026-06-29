"use client";

import { motion } from "framer-motion";
import { Construction, LucideHand, Medal } from "lucide-react";

const features = [
  {
    title: "Swiss Movements",
    description:
      "In-house mechanical calibers designed, engineered, and assembled entirely within our Geneva manufacture.",
    icon: Construction,
  },
  {
    title: "Hand-Finished",
    description:
      "Every visible and hidden surface is decorated by hand, featuring anglage, perlage, and Côtes de Genève.",
    icon: LucideHand,
  },
  {
    title: "Lifetime Service",
    description:
      "Our commitment extends beyond purchase. We guarantee restorative servicing throughout the lifetime of every timepiece.",
    icon: Medal,
  },
];

const Hero3 = () => {
  return (
    <section className="bg-neutral text-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <p className="uppercase text-primary text-xs mb-4">
            Craftsmanship Without Compromise
          </p>

          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold">
            The Pursuit of Excellence
          </h2>

          <div className="w-24 h-px bg-primary mx-auto mt-8" />
        </motion.div>

        {/* Features */}
        <div className="grid lg:grid-cols-3 border-y border-white/10">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                }}
                className={`
                  px-8 md:px-12 py-14
                  ${
                    index !== features.length - 1
                      ? "lg:border-r border-white/10"
                      : ""
                  }
                `}
              >
                <div className="mb-8 text-primary">
                  <Icon size={38} strokeWidth={1.5} />
                </div>

                <div className="space-y-5">
                  <h3 className="font-playfair text-3xl font-semibold">
                    {feature.title}
                  </h3>

                  <div className="w-12 h-px bg-primary" />

                  <p className="text-secondary/80 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero3;
