"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";

const WHATSAPP = "https://wa.me/96171346754?text=Hello%20Baydoun%2C%20I%27d%20like%20help%20choosing%20a%20watch.";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Baydoun+Est.";

/** Shop hours: Monday to Saturday, 09:00 to 19:00, Beirut time. */
function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Beirut", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date());
      const day = parts.find((p) => p.type === "weekday")?.value;
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      setOpen(day !== "Sun" && hour >= 9 && hour < 19);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

/**
 * A black room with a gold spotlight that follows the pointer, inviting
 * visitors to ask for help by WhatsApp or to come to the shop.
 */
const HelpChoose = () => {
  const ref = useRef<HTMLElement>(null);
  const open = useOpenNow();

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--sx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--sy", `${e.clientY - rect.top}px`);
      }}
      style={{ ["--sx" as string]: "70%", ["--sy" as string]: "40%" }}
      className="relative overflow-hidden bg-ink px-6 py-28 text-paper sm:px-10 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-300"
        style={{ background: "radial-gradient(520px circle at var(--sx) var(--sy), rgba(212,171,98,0.22), rgba(28,26,23,0) 60%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <RevealHeading lines={["Not sure which one?", "We'll help you choose."]} className="text-5xl text-paper sm:text-7xl" />
          <p className="mt-8 max-w-lg font-jost text-lg leading-relaxed text-paper/65">
            Tell us who it&apos;s for and your budget. We&apos;ll send you a few watches we love, or welcome you at the counter
            to try them on.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.2, 0.9, 0.1, 1] }}
          className="flex flex-col gap-4 font-jost"
        >
          {open !== null && (
            <p className="inline-flex items-center gap-2 text-sm text-paper/75">
              <span className={`h-2 w-2 rounded-full ${open ? "animate-pulse bg-[#3ddc84]" : "bg-gold"}`} />
              {open ? "Open now in Beirut, until 19:00" : "Closed now. Message us and we'll reply when we open at 09:00"}
            </p>
          )}
          <Link
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between overflow-hidden rounded-full bg-gold px-7 py-5 text-ink"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
            <span className="relative flex items-center gap-3 text-sm tracking-[0.14em]">
              <BsWhatsapp size={20} /> Chat with us on WhatsApp
            </span>
            <span className="relative h-px w-8 bg-ink transition-all duration-500 group-hover:w-14" aria-hidden="true" />
          </Link>
          <Link
            href={MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-full border border-paper/25 px-7 py-5 text-paper transition-colors hover:border-gold"
          >
            <span className="flex items-center gap-3 text-sm tracking-[0.14em]">
              <MapPin size={20} /> Get directions to the shop
            </span>
            <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpChoose;
