import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
