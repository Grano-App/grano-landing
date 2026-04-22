import { cn } from "@/lib/cn";

type Tone = "green" | "warning" | "navy";

const tones: Record<Tone, string> = {
  green: "bg-green-50 text-green-700",
  warning: "bg-warning-bg text-warning",
  navy: "bg-navy-900/10 text-navy-900",
};

export function Pill({
  tone = "green",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
