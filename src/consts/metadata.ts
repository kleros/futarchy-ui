import { Metadata } from "next";

export const websiteUrl = "https://foresight.kleros.io";
export const siteName = "foresight.kleros.io";

export const metadata: Metadata = {
  title: "Foresight | Kleros",
  description: "Prediction markets for distilled human judgement",
  metadataBase: new URL(websiteUrl),
  twitter: {
    card: "summary_large_image",
    title: "Foresight | Kleros",
    description: "Prediction markets for distilled human judgement",
    site: siteName,
    creator: "@kleros_io",
    creatorId: "1467726470533754880",
    images: ["futarchy_kleros.png"],
  },
  openGraph: {
    title: "Foresight | Kleros",
    description: "Prediction markets for distilled human judgement",
    url: websiteUrl,
    siteName: siteName,
    images: ["futarchy_kleros.png"],
    locale: "en_US",
    type: "website",
  },
};
