import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "ghost" | "ghost-light";
  size?: "md" | "lg";
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-green-500 text-white shadow-cta hover:bg-green-600 active:bg-green-700",
  ghost:
    "text-navy-900 hover:bg-gray-100",
  "ghost-light":
    "text-white hover:bg-white/10",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-pill font-bold transition-colors transition-transform duration-200 hover:scale-[1.02]",
    variants[variant],
    sizes[size],
    className
  );
  if (href) {
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
