import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";
import { getAllProducts } from "@/lib/products";
import { Toaster } from "react-hot-toast";
import FloatingButtons from "@/components/floatingButtons";
import SmoothScroll from "@/components/motion/SmoothScroll";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getAllProducts();

  return (
    <SmoothScroll>
        <Navbar products={products} />
        {children}
        <Toaster
          toastOptions={{
            position: "bottom-right",
            style: {
              background: "#ffffff",
              color: "#1c1a17",
              border: "1px solid #d4ab62",
              borderRadius: "999px",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: "500",
            },
            duration: 5000,
          }}
        />
        <FloatingButtons />
        <Footer />
    </SmoothScroll>
  );
}
