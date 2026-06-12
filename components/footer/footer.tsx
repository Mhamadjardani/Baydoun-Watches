import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-neutral border-t border-white/10 text-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/baydoun-logo.webp"
                alt="Baydoun Watches"
                height={240}
                width={240}
                className="h-36 w-36 object-contain"
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Baydoun
                  <br />
                  watches
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Explore
            </p>
            <nav className="flex flex-col gap-2">
              <a
                href="/collections"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Collections
              </a>
              <a
                href="/heritage"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Heritage
              </a>
              <a
                href="/categories"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Categories
              </a>
              <a
                href="/contact"
                className="text-white/80 transition duration-300 hover:text-primary"
              >
                Experience
              </a>
            </nav>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Contact
            </p>
            <address className="not-italic space-y-2">
              <p className="text-white/80">test@baydounwatches.com</p>
              <p className="text-white/80">+961 71 210 071</p>
              <p className="text-white/80 text-xs">
                Monday–Friday
                <br />
                10:00 AM – 6:00 PM EST
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
