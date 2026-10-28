"use client";

import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { outOfStockImageClass } from "@/components/OutOfStockBadge";
import PageHeader from "@/components/showroom/PageHeader";
import WatchCard from "@/components/showroom/WatchCard";
import { BRAND_LABELS } from "@/lib/showcase";
import { AnimatePresence, motion } from "framer-motion";
import { CircleOff, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import WatchImage from "@/components/showroom/WatchImage";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const shippingEstimate = 5;

const ease = [0.2, 0.9, 0.1, 1] as const;

const labelClass =
  "block font-jost text-[11px] tracking-[0.18em] text-gold-deep";
const inputClass =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 font-jost text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold";

const ShoppingCartPage = ({ products }: { products: ProductCard[] }) => {
  const cartItems = useCommerceStore((state) => state.cartItems);
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);
  const setCartQuantity = useCommerceStore((state) => state.setCartQuantity);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    mobileNumber: "",
    email: "",
  });

  const cartProducts = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find(
            (currentProduct) =>
              currentProduct.slug === item.productSlug &&
              currentProduct.brand === item.productBrand,
          );

          if (!product) return null;

          // Calculate final price based on discount existence and value
          const currentPrice =
            product.discount && product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price;

          return { product, quantity: item.quantity, currentPrice };
        })
        .filter(
          (
            item,
          ): item is {
            product: ProductCard;
            quantity: number;
            currentPrice: number;
          } => Boolean(item),
        ),
    [cartItems, products], // Added products to dependencies
  );

  // Items marked out of stock after being added stay visible in the bag with a
  // warning, but are left out of the totals and the WhatsApp order.
  const orderableProducts = cartProducts.filter(
    (item) => !item.product.isOutOfStock,
  );
  const unavailableProducts = cartProducts.filter(
    (item) => item.product.isOutOfStock,
  );

  // subtotal now correctly utilizes the discounted or original price
  const subtotal = orderableProducts.reduce(
    (total, item) => total + item.currentPrice * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? shippingEstimate : 0;
  const total = subtotal + shipping;

  const buildWhatsAppMessage = () => {
    const customerInfo = `
🧾 *New Order Request*

👤 *Customer Details*
• Name: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Phone: ${formData.mobileNumber}

📍 *Delivery Address*
• Address: ${formData.address}
• Apartment: ${formData.apartment || "-"}
• City: ${formData.city}
`;

    const items = orderableProducts
      .map((item, index) => {
        // Determine if we should display the discount breakdown in text
        const hasDiscount = item.product.discount && item.product.discount > 0;
        const priceDisplay = hasDiscount
          ? `~~$${item.product.price}~~ *$${item.currentPrice.toFixed(2)}* (${item.product.discount}% OFF)`
          : `$${item.product.price}`;

        return `
🛒 *Item ${index + 1}*
• Product: ${item.product.title}
• Brand: ${item.product.brand}
• SKU: ${item.product.sku}
• Qty: ${item.quantity}
• Price: ${priceDisplay}
`;
      })
      .join("\n");

    const summary = `
💰 *Order Summary*
• Subtotal: $${subtotal.toFixed(2)}
• Shipping: $${shipping.toFixed(2)}
• *Total Price: $${total.toFixed(2)}*
`;

    return encodeURIComponent(`${customerInfo}\n${items}\n${summary}`);
  };

  const makeKey = (brand: string, slug: string) =>
    `${brand.toLowerCase()}:${slug}`;

  const recommendedProducts = useMemo(() => {
    const cartKeys = new Set(
      cartProducts.map((item) =>
        makeKey(item.product.brand, item.product.slug),
      ),
    );

    const cartBrands = new Set(
      cartProducts.map((item) => item.product.brand.toLowerCase()),
    );

    const inStockProducts = products.filter((product) => !product.isOutOfStock);

    const sameBrandProducts = inStockProducts
      .filter((product) => {
        const key = makeKey(product.brand, product.slug);

        return (
          !cartKeys.has(key) && cartBrands.has(product.brand.toLowerCase())
        );
      })
      .slice(0, 8);

    const fallbackProducts = inStockProducts.filter((product) => {
      const key = makeKey(product.brand, product.slug);
      return !cartKeys.has(key);
    });

    const recommendationPool =
      sameBrandProducts.length > 0
        ? sameBrandProducts
        : fallbackProducts.length > 0
          ? fallbackProducts
          : inStockProducts;

    return recommendationPool.slice(0, 6);
  }, [cartProducts, products]);

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const getImage = (product: ProductCard) =>
    failedImages.has(product.image) ? "/baydoun-logo.webp" : product.image;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const phoneNumber = "96171346754";

    const message = buildWhatsAppMessage();

    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    setFormData({
      address: "",
      apartment: "",
      city: "",
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    });
    orderableProducts.forEach((product) =>
      removeFromCart(product.product.brand, product.product.slug),
    );

    window.open(url, "_blank");
  };

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
        <div className="mx-auto max-w-[1500px] py-24 text-center">
          <p className="font-serif text-2xl font-light text-ink/60">
            Preparing your bag…
          </p>
        </div>
      </main>
    );
  }

  const itemCount = cartProducts.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Your bag"
          title={["Your selection"]}
          caption="Check your watches and quantities, then send us your order on WhatsApp. We confirm every order personally before it ships."
          aside={
            cartProducts.length > 0 ? (
              <p className="font-jost text-sm text-ink/60">
                <span className="font-serif text-3xl text-ink">
                  {itemCount}
                </span>{" "}
                {itemCount === 1 ? "piece" : "pieces"} in your bag
              </p>
            ) : undefined
          }
        />

        {cartProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="flex flex-col items-center px-2 py-24 text-center"
          >
            <p className="max-w-xl font-serif text-3xl font-light leading-snug sm:text-4xl">
              Your bag is empty for now.
            </p>
            <p className="mt-4 max-w-md font-jost text-base leading-relaxed text-ink/60">
              Add a watch from the collection and it will wait here for you,
              even if you close the page.
            </p>
            <Link
              href="/collections"
              className="group relative mt-10 overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors group-hover:text-ink">
                Explore the collection
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
            <div className="min-w-0">
              {unavailableProducts.length > 0 && (
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gold/60 bg-paper px-5 py-4 font-jost text-sm text-ink sm:flex-row sm:items-center sm:justify-between">
                  <p className="inline-flex items-start gap-3">
                    <CircleOff
                      size={16}
                      className="mt-0.5 shrink-0 text-gold-deep"
                    />
                    {unavailableProducts.length === 1
                      ? "1 item in your bag is out of stock and won't be included in your order."
                      : `${unavailableProducts.length} items in your bag are out of stock and won't be included in your order.`}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      unavailableProducts.forEach(({ product }) =>
                        removeFromCart(product.brand, product.slug),
                      )
                    }
                    className="w-fit shrink-0 cursor-pointer rounded-full border border-ink/20 px-4 py-2 text-xs tracking-[0.14em] text-ink transition-colors hover:border-gold hover:bg-gold"
                  >
                    Remove {unavailableProducts.length === 1 ? "it" : "them"}
                  </button>
                </div>
              )}

              <ul className="border-t border-gold/25">
                <AnimatePresence>
                  {cartProducts.map(({ product, quantity }, index) => {
                    const href = `/collections/${product.brand}/${product.slug}`;
                    const hasDiscount = Boolean(
                      product.discount && product.discount > 0,
                    );
                    const lineTotal =
                      product.price *
                      (hasDiscount ? 1 - (product.discount ?? 0) / 100 : 1) *
                      quantity;

                    return (
                      <motion.li
                        key={`${product.brand}:${product.slug}`}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.7, delay: index * 0.06, ease }}
                        className="relative grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-gold/25 py-6 sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:gap-6"
                      >
                        <Link
                          href={href}
                          className="relative block aspect-square overflow-hidden rounded-2xl bg-[#f6f5f1]"
                        >
                          <WatchImage
                            src={getImage(product) || "/baydoun-logo.webp"}
                            alt={product.title}
                            onMissing={() => markImageFailed(product.image)}
                            className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 hover:scale-105 ${outOfStockImageClass(product)}`}
                          />
                        </Link>

                        <div className="flex min-w-0 flex-col gap-3 pr-10 font-jost sm:pr-0">
                          <div>
                            <p className="text-[11px] tracking-[0.18em] text-gold-deep">
                              {(
                                BRAND_LABELS[product.brand] ?? product.brand
                              ).toUpperCase()}
                            </p>
                            <Link
                              href={href}
                              className="mt-1 block text-base leading-snug text-ink transition-colors hover:text-gold-deep sm:text-lg"
                            >
                              {product.title}
                            </Link>
                          </div>

                          {/* Price sits under the title on phones */}
                          <p
                            className={`flex items-baseline gap-2 sm:hidden ${product.isOutOfStock ? "opacity-40" : ""}`}
                          >
                            <span className="font-serif text-2xl">
                              {formatPrice(lineTotal)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-ink/45 line-through">
                                {formatPrice(product.price * quantity)}
                              </span>
                            )}
                          </p>

                          {product.isOutOfStock ? (
                            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/20 px-3 py-1.5 text-xs tracking-[0.12em] text-ink">
                              <CircleOff size={14} />
                              Out of stock
                            </p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.title} quantity`}
                                onClick={() =>
                                  setCartQuantity(
                                    product.brand,
                                    product.slug,
                                    quantity - 1,
                                  )
                                }
                                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:border-gold"
                              >
                                <Minus size={14} />
                              </button>
                              <span
                                className="min-w-6 text-center font-serif text-xl"
                                aria-live="polite"
                              >
                                {quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase ${product.title} quantity`}
                                onClick={() =>
                                  addToCart(product.brand, product.slug)
                                }
                                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:border-gold"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div
                          className={`hidden flex-col items-end justify-end font-jost sm:flex ${product.isOutOfStock ? "opacity-40" : ""}`}
                        >
                          <span className="font-serif text-2xl">
                            {formatPrice(lineTotal)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-ink/45 line-through">
                              {formatPrice(product.price * quantity)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.title} from cart`}
                          onClick={() =>
                            removeFromCart(product.brand, product.slug)
                          }
                          className="absolute right-0 top-6 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:border-gold hover:text-gold-deep"
                        >
                          <X size={16} />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="h-fit rounded-[1.5rem] border border-gold/25 bg-paper p-6 font-jost lg:sticky lg:top-28"
            >
              <h2 className="font-serif text-3xl font-light">Order summary</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                Delivery is a flat estimate. We confirm the final amount with
                you on WhatsApp.
              </p>

              <dl className="mt-6 space-y-3 border-y border-gold/25 py-5 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd className="font-serif text-xl">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink/60">Estimated delivery</dt>
                  <dd className="font-serif text-xl">
                    {formatPrice(shipping)}
                  </dd>
                </div>
              </dl>

              <div className="flex items-baseline justify-between gap-4 py-5">
                <span className="text-[11px] tracking-[0.18em] text-gold-deep">
                  TOTAL
                </span>
                <span className="font-serif text-4xl">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                disabled={orderableProducts.length === 0}
                onClick={() => setShowCheckout(!showCheckout)}
                aria-expanded={showCheckout}
                className="group relative w-full cursor-pointer overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-enabled:group-hover:scale-x-100" />
                <span className="relative transition-colors group-enabled:group-hover:text-ink">
                  {showCheckout ? "Hide checkout" : "Proceed to checkout"}
                </span>
              </button>

              <Link
                href="/collections"
                className="group mt-5 inline-flex items-center gap-3 font-jost text-sm tracking-[0.14em] text-ink"
              >
                Keep browsing
                <span
                  className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14"
                  aria-hidden="true"
                />
              </Link>
            </motion.aside>
          </div>
        )}

        <AnimatePresence>
          {showCheckout && orderableProducts.length > 0 && (
            <motion.section
              key="checkout"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease }}
              className="mt-16 border-t border-gold/25 pt-12"
            >
              <p className="font-jost text-[11px] tracking-[0.18em] text-gold-deep">
                DELIVERY DETAILS
              </p>
              <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
                Where should we deliver?
              </h2>
              <p className="mt-3 max-w-xl font-jost text-base leading-relaxed text-ink/60">
                Fill in your details and we will open WhatsApp with your order
                ready to send.
              </p>

              <form
                onSubmit={handleCheckoutSubmit}
                className="mt-8 grid gap-6 rounded-[1.5rem] border border-gold/25 bg-paper p-6 sm:p-8 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <label htmlFor="firstName" className={labelClass}>
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Karim"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className={labelClass}>
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Haddad"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    STREET ADDRESS
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    autoComplete="address-line1"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Street, building"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="apartment" className={labelClass}>
                    APARTMENT, FLOOR <span className="tracking-normal text-ink/40">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    autoComplete="address-line2"
                    value={formData.apartment}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="3rd floor, apartment 5"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className={labelClass}>
                    CITY
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Beirut"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className={labelClass}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mobileNumber" className={labelClass}>
                    MOBILE NUMBER
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    autoComplete="tel"
                    value={formData.mobileNumber}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="+961 70 000 000"
                  />
                </div>

                <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <p className="font-jost text-sm text-ink/60">
                    Total to confirm:{" "}
                    <span className="font-serif text-2xl text-ink">
                      {formatPrice(total)}
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="group relative cursor-pointer overflow-hidden rounded-full bg-ink px-8 py-4 font-jost text-sm tracking-[0.14em] text-paper"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
                    <span className="relative transition-colors group-hover:text-ink">
                      Send order on WhatsApp
                    </span>
                  </button>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        {recommendedProducts.length > 0 && cartProducts.length > 0 && (
          <section className="mt-24 border-t border-gold/25 pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-jost text-[11px] tracking-[0.18em] text-gold-deep">
                  YOU MAY ALSO LIKE
                </p>
                <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
                  Pairs well with your bag
                </h2>
              </div>
              <Link
                href="/collections"
                className="group inline-flex items-center gap-3 font-jost text-sm tracking-[0.14em] text-ink"
              >
                View all
                <span
                  className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-6">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={`${product.brand}:${product.slug}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease }}
                >
                  <WatchCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ShoppingCartPage;
