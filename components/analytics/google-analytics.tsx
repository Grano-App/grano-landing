"use client";
import { useEffect } from "react";
import Script from "next/script";
import { rememberUtm, track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Підключає GA4 (якщо задано NEXT_PUBLIC_GA_ID), запам'ятовує UTM візиту й рахує кліки:
 * `tel:` → click_phone, посилання з data-track="<подія>" → ця подія з data-track-label.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    rememberUtm();
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      if (link.getAttribute("href")?.startsWith("tel:")) {
        track("click_phone", { location: link.dataset.trackLabel ?? "" });
      } else if (link.dataset.track) {
        track(link.dataset.track, { label: link.dataset.trackLabel ?? "" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
