import { cn } from "@/lib/cn";

/** Заголовок секції H2 з необов'язковим підзаголовком. */
export function SectionTitle({ children, lede, center, className }: {
  children: React.ReactNode;
  lede?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 flex max-w-3xl flex-col gap-4", center && "mx-auto text-center", className)}>
      <h2 className="font-display text-h2 font-bold">{children}</h2>
      {lede && <p className="text-lede text-navy-500">{lede}</p>}
    </div>
  );
}
