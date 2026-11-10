import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  /** `light` — для світлого фону (темні літери), `dark` — для темного (білі літери). */
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

// Логотип з grano.in.ua (714×174). Біла версія — та сама картинка з перефарбованими літерами.
export function Logo({ variant = "light", className, priority }: Props) {
  const src = variant === "dark" ? "/brand/grano-logo-white.png" : "/brand/grano-logo.png";
  return (
    <Image
      src={src}
      alt="Grano"
      width={714}
      height={174}
      priority={priority}
      className={cn("h-8 w-auto", className)}
    />
  );
}
