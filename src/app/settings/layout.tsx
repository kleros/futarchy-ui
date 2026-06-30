import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";

import Web3Context from "@/context/Web3Context";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <Web3Context cookies={cookies}>
      <ToastContainer className="p-4 pt-[70px]" />
      <Header />
      {children}
      <Footer />
    </Web3Context>
  );
}
