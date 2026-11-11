import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Підпис під рамкою, напр. «Пальне по полях за сезон · Демонстраційні дані». */
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Рамка вікна браузера для скріншотів веб-кабінету. */
export function BrowserFrame({ src, alt, width, height, caption, priority, sizes, className }: Props) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div className="overflow-hidden rounded-[14px] border border-gray-200 bg-white shadow-mockup">
        <div className="flex h-7 items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
        </div>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 640px, 100vw"}
          className="h-auto w-full"
        />
      </div>
      {caption && <figcaption className="text-xs text-navy-500">{caption}</figcaption>}
    </figure>
  );
}
