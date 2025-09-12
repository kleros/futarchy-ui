import type { Metadata } from "next";

import clsx from "clsx";
import localFont from "next/font/local";
import { headers } from "next/headers";

import Web3Context from "@/context/Web3Context";

import "@kleros/ui-components-library/style.css";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import { ThemeProvider } from "next-themes";

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

export const metadata: Metadata = {
  title: "Futarchy | Kleros",
  description: "Prediction markets for distilled human judgement",
  metadataBase: new URL("https://futarchy.kleros.builders"),
  twitter: {
    card: "summary_large_image",
    title: "Futarchy | Kleros",
    description: "Prediction markets for distilled human judgement",
    site: "futarchy.kleros.builders",
    creator: "@kleros_io",
    creatorId: "1467726470533754880",
    images: ["futarchy_kleros.png"],
  },
  openGraph: {
    title: "Futarchy | Kleros",
    description: "Prediction markets for distilled human judgement",
    url: "https://futarchy.kleros.builders/",
    siteName: "futarchy.kleros.builders",
    images: ["futarchy_kleros.png"],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en" className="box-border size-full" suppressHydrationWarning>
      <body
        className={clsx(
          `${geistSans.variable} ${geistMono.variable} bg-klerosUIComponentsLightBackground antialiased`,
          "flex size-full flex-col",
        )}
      >
        <Web3Context {...{ cookies }}>
          <ThemeProvider themes={["light", "dark"]} attribute="class">
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </Web3Context>
      </body>
    </html>
  );
}
