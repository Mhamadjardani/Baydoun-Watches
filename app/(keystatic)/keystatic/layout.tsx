import KeystaticApp from "./keystatic";

export default function Layout() {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="min-h-full flex flex-col">
        <KeystaticApp />
      </body>
    </html>
  );
}
