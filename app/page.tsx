import Hero1 from "@/components/home/hero1";
import Hero2 from "@/components/home/hero2";
import Hero3 from "@/components/home/hero3";
import Hero4 from "@/components/home/hero4";
import Hero5 from "@/components/home/hero5";

export default function Home() {
  return (
    <div className="bg-light-neutral space-y-10 overflow-hidden">
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
    </div>
  );
}
