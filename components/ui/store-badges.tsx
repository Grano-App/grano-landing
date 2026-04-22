import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a href={site.appStoreUrl} target="_blank" rel="noreferrer" aria-label="Скачати в App Store">
        <Image
          src="/store-badges/app-store.svg"
          alt="App Store"
          width={160}
          height={52}
          className="h-12 w-auto"
        />
      </a>
      <a href={site.playStoreUrl} target="_blank" rel="noreferrer" aria-label="Скачати в Google Play">
        <Image
          src="/store-badges/google-play.svg"
          alt="Google Play"
          width={180}
          height={52}
          className="h-12 w-auto"
        />
      </a>
    </div>
  );
}
