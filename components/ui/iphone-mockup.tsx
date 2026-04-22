import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function IPhoneMockup({ src, alt, priority, className }: Props) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[320px] rounded-[44px] border-8 border-navy-900 bg-navy-900 shadow-mockup",
        className
      )}
    >
      <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-navy-900" />
      <div className="overflow-hidden rounded-[36px] bg-white">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={1386}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
