import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/HomepageHeader";

export const dynamic = "force-static";

export default function HomepageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
