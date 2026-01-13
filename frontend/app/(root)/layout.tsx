import Header from "@/components/header";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer";
import "@/assets/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
