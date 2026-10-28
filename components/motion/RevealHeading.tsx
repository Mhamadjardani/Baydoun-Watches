"use client";

import { motion } from "framer-motion";

/**
 * Section heading that rises line by line from behind a mask, with a gold
 * hairline drawing in underneath. Used for every homepage heading so the
 * page has one consistent entrance.
 */
export default function RevealHeading({
  lines,
  as: Tag = "h2",
  className = "",
  align = "left",
  rule = true,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "left" | "center";
  rule?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Tag className={`font-serif font-light leading-[1.02] ${className}`}>
        {lines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: [0.2, 0.9, 0.1, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
      {rule && (
        <motion.span
          aria-hidden="true"
          className={`mt-6 block h-px w-20 bg-gold ${align === "center" ? "mx-auto origin-center" : "origin-left"}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, delay: 0.3 + lines.length * 0.12, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </div>
  );
}
