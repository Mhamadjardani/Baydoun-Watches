"use client";

import products from "@/data/products.json";
import { useCommerceStore } from "@/store/useCommerceStore";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Product = (typeof products)[number];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const shippingEstimate = 12;

const ShoppingCartPage = () => {
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
            (currentProduct) => currentProduct.id === item.productId,
          );

          return product ? { product, quantity: item.quantity } : null;
        })
        .filter(
          (
            item,
          ): item is {
            product: Product;
            quantity: number;
          } => Boolean(item),
        ),
    [cartItems],
  );

  const subtotal = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? shippingEstimate : 0;
  const total = subtotal + shipping;

  const recommendedProducts = useMemo(() => {
    const cartBrands = new Set(
      cartProducts.map((item) => item.product.brand.toLowerCase()),
    );
    const cartIds = new Set(cartProducts.map((item) => item.product.id));
    const sameBrandProducts = products.filter(
      (product) =>
        !cartIds.has(product.id) && cartBrands.has(product.brand.toLowerCase()),
    );
    const fallbackProducts = products.filter(
      (product) => !cartIds.has(product.id),
    );
    const recommendationPool =
      sameBrandProducts.length > 0
        ? sameBrandProducts
        : fallbackProducts.length > 0
          ? fallbackProducts
          : products;

    return recommendationPool.slice(0, 6);
  }, [cartProducts]);

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  const getImage = (product: Product) =>
    failedImages.has(product.images[0]) ? "/test.png" : product.images[0];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Checkout data:", formData);
  };

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
        <section className="mx-auto max-w-screen-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-widest text-secondary">
            Preparing your shopping bag
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Secure checkout
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                Shopping Bag
              </p>
              <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
                Review your selected timepieces, adjust quantities, and continue
                to a refined checkout experience.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-4 py-3 text-xs uppercase tracking-widest text-primary">
              <ShoppingBag size={16} />
              {cartProducts.length} items
            </div>
          </div>
        </div>

        {cartProducts.length === 0 ? (
          <div className="border border-white/10 bg-white/3 px-6 py-20 text-center">
            <p className="text-2xl font-bold uppercase tracking-widest text-white font-playfair">
              Your bag is empty
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 tracking-wide text-secondary">
              Add a watch from the collections page and it will stay here even
              after refresh.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center justify-center gap-3 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-neutral transition hover:bg-secondary"
            >
              Explore collections
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
            <div className="space-y-4">
              {cartProducts.map(({ product, quantity }) => (
                <article
                  key={product.id}
                  className="relative grid gap-4 p-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:p-5 border-b last:border-0 border-white/10"
                >
                  <Link
                    href={`/collections/${product.id}`}
                    className="relative aspect-square overflow-hidden bg-neutral sm:h-38 sm:w-38"
                  >
                    <Image
                      src={getImage(product)}
                      alt={product.title}
                      fill
                      sizes="160px"
                      className="object-cover transition duration-500 hover:scale-105"
                      onError={() => markImageFailed(product.images[0])}
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col justify-between gap-5 pr-10 sm:pr-0">
                    <div className="space-y-2">
                      <p className="w-fit bg-primary/10 px-2 py-1 text-xs uppercase tracking-widest text-primary">
                        {product.brand} / {product.category}
                      </p>
                      <Link
                        href={`/collections/${product.id}`}
                        className="block text-xl font-bold uppercase tracking-widest text-white transition hover:text-primary font-playfair"
                      >
                        {product.title}
                      </Link>
                      <p className="max-w-2xl text-sm leading-6 text-secondary">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex w-fit items-center border border-white/10 bg-neutral">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.title} quantity`}
                        onClick={() =>
                          setCartQuantity(product.id, quantity - 1)
                        }
                        className="flex h-10 w-10 cursor-pointer items-center justify-center text-primary transition hover:bg-white/10"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="flex h-10 min-w-12 items-center justify-center border-x border-white/10 px-3 text-sm font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${product.title} quantity`}
                        onClick={() => addToCart(product.id)}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center text-primary transition hover:bg-white/10"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      aria-label={`Remove ${product.title} from cart`}
                      onClick={() => removeFromCart(product.id)}
                      className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center border border-white/10 text-secondary transition hover:border-primary/40 hover:text-primary"
                    >
                      <X size={18} />
                    </button>
                    <div className="ml-auto mt-2 border border-primary/20 bg-primary/10 px-2 py-1 text-right sm:mt-auto">
                      <p className="mt-1 text-lg font-bold text-primary">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit border border-primary/15 bg-neutral p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] lg:sticky lg:top-24">
              <div className="border-b border-white/10 pb-5">
                <p className="text-xl font-bold uppercase tracking-widest text-white font-playfair">
                  Order summary
                </p>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Shipping is estimated and final taxes are calculated during
                  checkout.
                </p>
              </div>

              <div className="space-y-4 border-b border-white/10 py-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="uppercase tracking-widest text-secondary/70">
                    Subtotal
                  </span>
                  <span className="font-bold text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="uppercase tracking-widest text-secondary/70">
                    Estimated shipping
                  </span>
                  <span className="font-bold text-white">
                    {formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 py-5">
                <span className="text-sm uppercase tracking-widest text-secondary">
                  Total
                </span>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckout(!showCheckout)}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-3 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-neutral transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {showCheckout ? "Hide checkout" : "Proceed to checkout"}
                <ArrowRight size={18} />
              </button>
            </aside>
          </div>
        )}

        {showCheckout && cartProducts.length > 0 && (
          <section className="border-t border-white/10 pt-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  Shipping Information
                </p>
                <h3 className="text-3xl font-black uppercase tracking-widest text-white font-playfair">
                  Delivery Address
                </h3>
              </div>

              <form
                onSubmit={handleCheckoutSubmit}
                className="grid gap-6 rounded-3xl border border-white/10 bg-light-neutral/40 p-6 sm:p-8 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="Doe"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="123 Luxury Avenue"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="apartment" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="Unit 1200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mobileNumber" className="block text-xs uppercase tracking-[0.35em] text-secondary/70">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.35em] text-neutral transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 md:col-span-2"
                >
                  Complete Order
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </section>
        )}

        {recommendedProducts.length > 0 && (
          <section className="space-y-5 border-t border-white/10 pt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  You may also like
                </p>
                <p className="mt-3 text-2xl font-bold uppercase tracking-widest text-white font-playfair">
                  Complementary pieces
                </p>
              </div>
              <Link
                href="/collections"
                className="hidden text-xs font-bold uppercase tracking-widest text-primary transition hover:text-secondary sm:inline"
              >
                View all
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3">
              {recommendedProducts.map((product, index) => (
                <Link
                  key={`${product.id}-recommended-${index}`}
                  href={`/collections/${product.id}`}
                  className="group w-56 shrink-0 border border-white/10 bg-white/3 transition hover:border-primary/30"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-neutral">
                    <Image
                      src={getImage(product)}
                      alt={product.title}
                      fill
                      sizes="224px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      onError={() => markImageFailed(product.images[0])}
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-widest text-primary">
                      {product.brand}
                    </p>
                    <p className="min-h-11 text-sm font-bold uppercase leading-5 tracking-widest text-white font-playfair">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default ShoppingCartPage;
