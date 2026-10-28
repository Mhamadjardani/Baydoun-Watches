import Image from "next/image";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { FiFacebook } from "react-icons/fi";

const linkClass = "text-paper/70 transition-colors duration-300 hover:text-gold";
const headingClass = "font-jost text-xs tracking-[0.3em] text-gold";

const Footer = () => {
  return (
    <footer className="relative bg-ink font-jost text-paper">
      <div className="mx-auto max-w-7xl border-t border-gold/30 px-6 py-16 sm:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/baydoun-logo-removebg-preview.png"
              alt="Baydoun Watches"
              width={180}
              height={135}
              loading="eager"
              className="h-auto w-36"
            />
            <p className="mt-5 max-w-xs font-serif text-xl font-light italic text-paper/80">
              Watches, bracelets and wallets, delivered across Lebanon.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <h2 className={headingClass}>EXPLORE</h2>
            <nav className="flex flex-col gap-2.5">
              <Link href="/collections" className={linkClass}>Collection</Link>
              <Link href="/sales" className={linkClass}>Sales</Link>
              <Link href="/heritage" className={linkClass}>About us</Link>
              <Link href="/categories" className={linkClass}>Categories</Link>
              <Link href="/contact" className={linkClass}>Contact us</Link>
            </nav>
          </div>

          <div className="space-y-4 text-sm">
            <h2 className={headingClass}>CONTACT</h2>
            <address className="flex flex-col gap-2.5 not-italic">
              <Link href="mailto:baydoun.est08@gmail.com" className={`${linkClass} break-all`}>
                baydoun.est08@gmail.com
              </Link>
              <Link href="tel:+96171346754" className={linkClass}>+961 71 346 754</Link>
              <Link href="tel:+9611346754" className={linkClass}>+961 1 346 754</Link>
              <p className="text-paper/50">
                Monday to Saturday
                <br />
                09:00 AM to 07:00 PM
              </p>
            </address>
          </div>

          <div className="space-y-4 text-sm">
            <h2 className={headingClass}>FOLLOW US</h2>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/baydoun_est?stkn=MnY4ZDhlZTAwM2Rk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-paper/80 transition-all duration-500 hover:rotate-[360deg] hover:border-gold hover:text-gold"
              >
                <BsInstagram size={18} />
              </Link>
              <Link
                href="https://www.facebook.com/share/19YyzjCim9/?mibextid=wwXI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-paper/80 transition-all duration-500 hover:rotate-[360deg] hover:border-gold hover:text-gold"
              >
                <FiFacebook size={18} />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-16 border-t border-paper/10 pt-6 text-xs text-paper/40">
          © {new Date().getFullYear()} Baydoun Watches, Lebanon
        </p>
      </div>
    </footer>
  );
};

export default Footer;
