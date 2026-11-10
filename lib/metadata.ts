import type { Metadata } from "next";
import { site } from "@/content/site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "облік господарства",
    "облік пального",
    "облік техніки",
    "датчики пального",
    "облік полів",
    "насіння й засоби захисту",
    "Grano",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};
