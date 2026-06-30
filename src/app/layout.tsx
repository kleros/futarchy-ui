import { ThemeProvider } from "next-themes";

import clsx from "clsx";
import localFont from "next/font/local";

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
  return (
    <html lang="en" className="box-border size-full" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Foresight | Kleros" />
      </head>
      <body
        className={clsx(
          `${geistSans.variable} ${geistMono.variable} bg-klerosUIComponentsLightBackground antialiased`,
          "flex size-full flex-col",
        )}
      >
        <ThemeProvider themes={["light", "dark"]} attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
