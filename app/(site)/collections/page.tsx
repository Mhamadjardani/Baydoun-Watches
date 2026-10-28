import ProductsCollection from "@/components/collections/ProductsCollection";
import { getAllProducts } from "@/lib/products";
import { Suspense } from "react";

export default async function CollectionsPage() {
  const products = await getAllProducts();

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
          <section className="mx-auto max-w-screen-2xl px-6 py-16 text-center">
            <p className="font-jost text-sm tracking-[0.3em] text-gold-deep">
              Loading collection
            </p>
          </section>
        </main>
      }
    >
      <ProductsCollection products={products} />
    </Suspense>
  );
}
