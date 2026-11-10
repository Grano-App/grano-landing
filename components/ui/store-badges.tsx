import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Значки сторів. `placement` іде в GA-подію click_store і в мітку utm_content
 * для Google Play (App Store без provider token міток не приймає).
 */
export function StoreBadges({ placement, className }: { placement: string; className?: string }) {
  const referrer = encodeURIComponent(`utm_source=grano-app.com&utm_medium=landing&utm_content=${placement}`);
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href={site.appStoreUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Завантажити в App Store"
        data-track="click_store"
        data-track-label={`app_store_${placement}`}
      >
        <Image src="/store-badges/app-store.svg" alt="App Store" width={160} height={52} className="h-12 w-auto" />
      </a>
      <a
        href={`${site.playStoreUrl}&referrer=${referrer}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Завантажити в Google Play"
        data-track="click_store"
        data-track-label={`google_play_${placement}`}
      >
        <Image src="/store-badges/google-play.svg" alt="Google Play" width={180} height={52} className="h-12 w-auto" />
      </a>
    </div>
  );
}
