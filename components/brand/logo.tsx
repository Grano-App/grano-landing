import Image from "next/image";

type Props = {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = "light", className, priority }: Props) {
  const src = variant === "dark" ? "/brand/logo-dark.svg" : "/brand/logo.svg";
  return (
    <Image
      src={src}
      alt="Grano"
      width={160}
      height={48}
      priority={priority}
      className={className}
    />
  );
}
