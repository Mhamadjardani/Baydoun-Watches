"use client";

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
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const Contact: React.FC = () => {
  return (
    <main className="min-h-screen bg-background px-6 py-24 text-white sm:px-10 lg:px-24">
      <section className="mx-auto max-w-screen-2xl">
        {/* HEADER */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-black uppercase tracking-[0.3em] text-primary font-playfair md:text-5xl"
          >
            Get in touch
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm tracking-[0.28em] text-secondary/90"
          >
            Send us a message or visit our boutique — we’re here to assist you
            with every detail of your experience.
          </motion.p>
        </motion.header>

        {/* GRID */}
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:items-start">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-1"
          >
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[1.25rem] border border-white/10 bg-white/4 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <p className="text-lg font-semibold uppercase tracking-[0.28em] text-primary">
                Send a message
              </p>

              <motion.form
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-6 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  const formData = new FormData(e.currentTarget);

                  const fullName = formData.get("fullName");
                  const email = formData.get("email");
                  const subject = formData.get("subject");
                  const message = formData.get("message");

                  const mailto = `mailto:test@gmail.com?subject=${encodeURIComponent(
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
                ].map((field) => (
                  <motion.div key={field.name} variants={fadeUp}>
                    <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                      {field.label}
                    </label>
                    <input
                      required
                      type={field.type}
                      name={field.name}
                      placeholder={field.label}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </motion.div>
                ))}

                <motion.div variants={fadeUp}>
                  <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                    Message
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    placeholder="Write your message..."
                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </motion.div>

                <motion.button
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  className="cursor-pointer mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.35em] text-neutral transition hover:bg-secondary"
                >
                  Send message
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* INFO CARD */}
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/6 bg-white/3 p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Our location
                </p>
                <p className="mt-3 text-sm text-white/80">
                  Beirut, El Malla
                  <br />
                  Algeria Street, Facing Croissant Saab
                </p>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Phone
                </p>
                <Link
                  href={`https://wa.me/9613558657`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact on WhatsApp"
                  className="mt-2 text-sm text-white/80 hover:underline hover:text-primary"
                >
                  +961 3 558 657
                </Link>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Opening hours
                </p>
                <div className="mt-2 text-sm text-white/80 space-y-1">
                  <p>Monday–Friday: 10:00 – 18:00</p>
                  <p>Saturday: 10:00 – 15:00</p>
                  <p>Sunday: Closed</p>
                </div>
              </motion.div>

              {/* IMAGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="order-first sm:order-last"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl overflow-hidden border border-white/6 bg-white/4"
                >
                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=Baydoun+Est."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative aspect-16/10 w-full cursor-pointer overflow-hidden rounded-2xl">
                      <Image
                        src="/contact.png"
                        alt="Location on map"
                        fill
                        className="object-cover transition hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                        Open in Google Maps
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm text-white/70"
            >
              <p>
                Prefer to speak with a specialist? Call us or visit the boutique
                during opening hours — we’re happy to arrange private viewings
                and consultations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
