// GA4 через gtag, що підключає components/analytics/google-analytics.tsx, і збереження UTM-міток візиту.
import { UTM_KEYS, type Utm } from "@/lib/lead";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Подія GA4. Без NEXT_PUBLIC_GA_ID gtag не завантажено, і виклик нічого не робить. */
export function track(event: string, params: Record<string, string | number> = {}) {
  window.gtag?.("event", event, params);
}

const UTM_STORAGE = "grano_utm";

/** Запам'ятовує UTM-мітки першого входу на сайт (QR дилера, розсилка) на час сесії. */
export function rememberUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length) sessionStorage.setItem(UTM_STORAGE, JSON.stringify(utm));
}

export function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE) ?? "{}") as Utm;
  } catch {
    return {};
  }
}
