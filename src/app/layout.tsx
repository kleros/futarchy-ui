import { ThemeProvider } from "next-themes";

import clsx from "clsx";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";

import QueryProvider from "@/context/QueryProvider";
import { Web3Root } from "@/context/Web3ReadyContext";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import "@kleros/ui-components-library/style.css";
import "./globals.css";

export { metadata } from "@/consts/metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en" className="box-border size-full" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Foresight | Kleros" />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          `${geistSans.variable} ${geistMono.variable} bg-klerosUIComponentsLightBackground antialiased`,
          "flex size-full flex-col",
        )}
      >
        <QueryProvider>
          <Web3Root {...{ cookies }}>
            <ThemeProvider themes={["light", "dark"]} attribute="class">
              <ToastContainer className="p-4 pt-[70px]" />
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </Web3Root>
        </QueryProvider>
      </body>
    </html>
  );
}
