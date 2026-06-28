"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";

export default function FloatingButtons() {
  const whatsappNumber = "96171210071";
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Baydoun+Est.";

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3">
      {/* WhatsApp */}
      <Link
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl"
      >
        <BsWhatsapp className="h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110" />
      </Link>

      {/* Location */}
      <Link
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Location"
        className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl"
      >
        <MapPin className="h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110" />
      </Link>
    </div>
  );
}
