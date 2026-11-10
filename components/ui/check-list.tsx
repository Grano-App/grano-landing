import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Список переваг з галочками. `tone="light"` — для темного фону. */
export function CheckList({ items, tone = "dark", className }: {
  items: readonly string[];
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className={cn("flex items-start gap-3 text-base", tone === "dark" ? "text-navy-700" : "text-white/80")}>
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
