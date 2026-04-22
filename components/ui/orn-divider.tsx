import { cn } from "@/lib/cn";

type Props = {
  tone?: "navy" | "white";
  className?: string;
};

export function OrnDivider({ tone = "navy", className }: Props) {
  const color = tone === "navy" ? "#1E2E3E" : "#FFFFFF";
  const opacity = tone === "navy" ? 0.2 : 0.3;
  const fill = encodeURIComponent(color);
  return (
    <div
      aria-hidden="true"
      className={cn("h-3 w-full", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12'%3E%3Cg fill='${fill}' fill-opacity='${opacity}'%3E%3Cpath d='M6 0L12 6L6 12L0 6Z'/%3E%3Cpath d='M18 0L24 6L18 12L12 6Z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "24px 12px",
        backgroundPosition: "center",
      }}
    />
  );
}
