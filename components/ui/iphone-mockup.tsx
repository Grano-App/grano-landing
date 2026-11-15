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
    <div className={cn("mx-auto w-full max-w-[320px] [container-type:inline-size]", className)}>
      <div className="relative rounded-[14cqw] bg-navy-900 p-[3cqw] shadow-mockup">
        <div className="absolute left-1/2 top-[3cqw] z-10 h-[7cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-navy-900" />
        <div className="overflow-hidden rounded-[11cqw] bg-white">
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
    </div>
  );
}
