import Image from "next/image";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { FiFacebook } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative bg-light-neutral text-white shadow-2xl shadow-primary">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 via-75% to-transparent shadow-[0_-4px_20px_rgba(var(--primary-rgb),0.6)]" />

      <div className="mx-auto max-w-screen-2xl px-6 pb-1 sm:py-10 sm:px-10 lg:px-16">
        {/* Adjusted grid column count to 4 on large screens to cleanly fit the new column */}
        <div className="grid grid-cols-2 gap-4 sm:gap-12 md:grid-cols-4">
          {/* Column 1: Logo */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/baydoun-logo-removebg-preview.png"
                alt="Baydoun Watches"
                height={240}
                width={240}
                className="h-36 w-36 object-contain"
              />
            </div>
          </div>
          {/* Column 2: Explore */}
          <div className="space-y-3 text-sm">
            <p className="sm:text-base uppercase tracking-wide text-primary font-semibold">
              Explore
            </p>
            <nav className="flex flex-col gap-2">
              <Link
                href="/collections"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Collection
              </Link>
              <Link
                href="/heritage"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/categories"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Categories
              </Link>
              <Link
                href="/contact"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Contact Us
              </Link>
            </nav>
          </div>
          {/* Column 3: Contact */}
          <div className="space-y-3 text-sm">
            <p className="sm:text-base uppercase tracking-wide text-primary font-semibold">
              Contact
            </p>
            <address className="not-italic space-y-2">
              <Link
                href="mailto:baydoun.est08@gmail.com"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                baydoun.est08@gmail.com
              </Link>
              <div className="flex space-x-2 flex-col gap-1 sm:flex-row">
                <Link
                  href="tel:+96171346754"
                  className="text-white/80 transition duration-300 hover:text-primary"
                >
                  +961 71 346 754
                </Link>
                <Link
                  href="tel:+9611346754"
                  className="text-white/80 transition duration-300 hover:text-primary"
                >
                  +961 1 346 754
                </Link>
              </div>
              <p className="text-white/80 text-xs">
                Monday–Saturday
                <br />
                09:00 AM – 07:00 PM
              </p>
            </address>
          </div>
          {/* Column 4: Follow Us */}
          <div className="space-y-3 text-sm">
            <p className="sm:text-base uppercase tracking-wide text-primary font-semibold">
              Follow Us
            </p>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <Link
                href="https://www.instagram.com/baydoun_est?stkn=MnY4ZDhlZTAwM2Rk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10 hover:text-primary"
              >
                <BsInstagram size={20} />
              </Link>

              {/* Facebook */}
              <Link
                href="https://www.facebook.com/share/19YyzjCim9/?mibextid=wwXI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10 hover:text-primary"
              >
                <FiFacebook size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
