import "../styles/globals.css";
import Nav from "@/components/Nav";
import BackgroundInitializer from "@/components/BackgroundInitializer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="gradient-bg">
        <BackgroundInitializer />
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
