"use client";

import React from "react";
import Image from "next/image";

const Contact: React.FC = () => {
  return (
    <main className="min-h-screen bg-background px-6 py-24 text-white sm:px-10 lg:px-24">
      <section className="mx-auto max-w-screen-2xl">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black uppercase tracking-[0.3em] text-primary font-playfair md:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-sm tracking-[0.28em] text-secondary/90">
            Send us a message or visit our boutique — we’re here to assist you
            with every detail of your experience.
          </p>
        </header>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:items-start">
          {/* Left: Contact form card (1/3) */}
          <div className="md:col-span-1">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <p className="text-lg font-semibold uppercase tracking-[0.28em] text-primary">
                Send a message
              </p>

              <form className="mt-6 flex flex-col gap-4">
                <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />

                <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />

                <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />

                <label className="text-xs uppercase tracking-[0.28em] text-secondary/80">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.35em] text-neutral transition hover:bg-secondary"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>

          {/* Right: Location, contact details and image (2/3) */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Our location
                </p>
                <p className="mt-3 text-sm text-white/80">
                  123 Heritage Lane
                  <br />
                  New York, NY 10001
                </p>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Phone
                </p>
                <p className="mt-2 text-sm text-white/80">+1 (800) 123-4567</p>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary/80">
                  Opening hours
                </p>
                <div className="mt-2 text-sm text-white/80 space-y-1">
                  <p>Monday–Friday: 10:00 – 18:00</p>
                  <p>Saturday: 10:00 – 15:00</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div className="order-first sm:order-last">
                <div className="rounded-2xl overflow-hidden border border-white/6 bg-white/4">
                  <div className="relative aspect-16/10 h-full w-full">
                    <Image
                      src="/contact.png"
                      alt="Contact"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-white/70">
              <p>
                Prefer to speak with a specialist? Call us or visit the boutique
                during opening hours — we’re happy to arrange private viewings
                and consultations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
