import Hero1 from "@/components/home/hero1";
import Hero2 from "@/components/home/hero2";
import Hero3 from "@/components/home/hero3";
import Hero4 from "@/components/home/hero4";
import Hero5 from "@/components/home/hero5";
import Hero6 from "@/components/home/hero6";
import Hero7 from "@/components/home/hero7";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <div className="bg-light-neutral space-y-10 overflow-hidden">
      <Hero1 />
      <Hero2 products={products} />
      <Hero3 />
      <Hero4 products={products} />
      <Hero5 />
      <Hero6 />
      <Hero7 />
    </div>
  );
}
