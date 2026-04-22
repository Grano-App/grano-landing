import { cn } from "@/lib/cn";

type Bg = "white" | "cream" | "navy";

const bgMap: Record<Bg, string> = {
  white: "bg-white text-navy-900",
  cream: "bg-cream-50 text-navy-900",
  navy: "bg-navy-900 text-white",
};

export function Section({
  id,
  bg = "white",
  className,
  children,
}: {
  id?: string;
  bg?: Bg;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-[120px]", bgMap[bg], className)}
    >
      {children}
    </section>
  );
}
