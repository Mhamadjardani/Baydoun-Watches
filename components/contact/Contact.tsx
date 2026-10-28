"use client";

import PageHeader from "@/components/showroom/PageHeader";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.2, 0.9, 0.1, 1],
    },
  },
};

const label = "font-jost text-[11px] tracking-[0.3em] text-gold-deep";
const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 font-jost text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold";
const card =
  "rounded-[1.5rem] border border-gold/25 bg-paper p-6 transition-colors duration-500 hover:border-gold sm:p-8";

const Contact: React.FC = () => {
  return (
    <main className="min-h-screen overflow-x-clip bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Visit or message us"
          title={["We'd love", "to help"]}
          caption="Send us a note, message us on WhatsApp, or pass by the shop in El Malla. We're happy to help you choose, check a size or set a watch aside."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5 lg:items-start lg:gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.9, 0.1, 1] }}
            className="rounded-[1.5rem] border border-gold/25 bg-[#f7f6f2] p-6 sm:p-10 lg:col-span-2"
          >
            <h2 className="font-serif text-4xl font-light">Send a message</h2>
            <span className="mt-5 block h-px w-14 bg-gold" aria-hidden="true" />

            <motion.form
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);

                const fullName = formData.get("fullName");
                const email = formData.get("email");
                const subject = formData.get("subject");
                const message = formData.get("message");

                const mailto = `mailto:baydoun.est08@gmail.com?subject=${encodeURIComponent(
                  subject as string,
                )}&body=${encodeURIComponent(
                  `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
                )}`;

                window.location.href = mailto;
              }}
            >
              {[
                { label: "Full name", name: "fullName", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Subject", name: "subject", type: "text" },
              ].map((f) => (
                <motion.div key={f.name} variants={fadeUp}>
                  <label htmlFor={`contact-${f.name}`} className={label}>
                    {f.label.toUpperCase()}
                  </label>
                  <input
                    id={`contact-${f.name}`}
                    required
                    type={f.type}
                    name={f.name}
                    placeholder={f.label}
                    className={field}
                  />
                </motion.div>
              ))}

              <motion.div variants={fadeUp}>
                <label htmlFor="contact-message" className={label}>
                  MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  required
                  name="message"
                  rows={6}
                  placeholder="Write your message..."
                  className={`${field} resize-none`}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  className="group relative mt-2 inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
                  <span className="relative transition-colors group-hover:text-ink">Send message</span>
                </button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* DETAILS */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:col-span-3"
          >
            {/* MAP */}
            <motion.div variants={fadeUp} className="sm:col-span-2">
              <Link
                href="https://www.google.com/maps/search/?api=1&query=Baydoun+Est."
                target="_blank"
                rel="noopener noreferrer"
                className="group grid overflow-hidden rounded-[1.5rem] border border-gold/25 bg-paper transition-colors duration-500 hover:border-gold sm:grid-cols-2"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f6f5f1] sm:aspect-auto sm:min-h-64">
                  <Image
                    src="/contact.png"
                    alt="Location on map"
                    loading="eager"
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className={label}>OUR LOCATION</p>
                  <p className="mt-4 font-serif text-3xl font-light leading-tight">
                    Beirut, El Malla
                  </p>
                  <p className="mt-2 font-jost text-sm leading-relaxed text-ink/60">
                    Algeria Street, Facing Croissant Saab
                  </p>
                  <span className="mt-6 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-ink/70 transition-colors group-hover:text-ink">
                    Open in Google Maps
                    <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* WHATSAPP / PHONE */}
            <motion.div variants={fadeUp} className={card}>
              <p className={label}>PHONE &amp; WHATSAPP</p>
              <Link
                href={`https://wa.me/96171346754`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
                className="group mt-4 block"
              >
                <span className="block font-serif text-3xl font-light transition-colors group-hover:text-gold-deep">
                  +961 71 346 754
                </span>
                <span className="mt-4 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-ink/70">
                  Message us on WhatsApp
                  <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>

            {/* EMAIL */}
            <motion.div variants={fadeUp} className={card}>
              <p className={label}>EMAIL</p>
              <a href="mailto:baydoun.est08@gmail.com" className="group mt-4 block">
                <span className="block break-all font-serif text-2xl font-light transition-colors group-hover:text-gold-deep sm:text-[1.7rem]">
                  baydoun.est08@gmail.com
                </span>
                <span className="mt-4 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-ink/70">
                  Write to us
                  <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
                </span>
              </a>
            </motion.div>

            {/* HOURS */}
            <motion.div
              variants={fadeUp}
              className="rounded-[1.5rem] bg-ink p-6 text-paper sm:col-span-2 sm:p-8"
            >
              <p className="font-jost text-[11px] tracking-[0.3em] text-gold">OPENING HOURS</p>
              <div className="mt-5 grid gap-4 font-jost sm:grid-cols-2">
                <div className="border-t border-gold/25 pt-4">
                  <p className="font-serif text-3xl font-light">Monday–Saturday</p>
                  <p className="mt-1 text-sm text-paper/60">09:00 – 19:00</p>
                </div>
                <div className="border-t border-gold/25 pt-4">
                  <p className="font-serif text-3xl font-light">Sunday</p>
                  <p className="mt-1 text-sm text-paper/60">Closed</p>
                </div>
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="font-jost text-sm leading-relaxed text-ink/60 sm:col-span-2"
            >
              Prefer to speak with someone? Call us or visit the shop during
              opening hours. We&apos;re happy to show you any watch in person.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
