import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";
import { getAllProducts } from "@/lib/products";
import { Toaster } from "react-hot-toast";
import FloatingButtons from "@/components/floatingButtons";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getAllProducts();

  return (
    <>
        <Navbar products={products} />
        {children}
        <Toaster
          toastOptions={{
            position: "bottom-right",
            style: {
              background: "#0a0a0a",
              color: "#c9a84c",
              border: "1px solid #c9a84c",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            duration: 5000,
          }}
        />
        <FloatingButtons />
        <Footer />
    </>
  );
}
