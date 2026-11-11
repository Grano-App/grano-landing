import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { comfortaa, unbounded } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${comfortaa.variable} ${unbounded.variable}`}>
      <body className="font-body antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
