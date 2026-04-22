import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { stats, statsDisclaimer } from "@/content/stats";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/cn";

const accentBg: Record<string, string> = {
  green: "bg-green-500 text-white",
  navy: "bg-navy-700 text-white",
  warning: "bg-warning text-white",
};

export function SocialProof() {
  return (
    <Section bg="cream">
      <Container>
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="font-display text-h2 font-bold text-navy-900">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-navy-500">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mb-16 text-center text-xs text-navy-500">{statsDisclaimer}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex flex-col gap-6 rounded-card bg-white p-6 shadow-card"
            >
              <blockquote className="text-base italic text-navy-900">
                "{t.quote}"
              </blockquote>
              <hr className="border-gray-200" />
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold",
                    accentBg[t.accent]
                  )}
                  aria-hidden="true"
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-900">{t.name}</div>
                  <div className="text-xs text-navy-500">
                    {t.role}, {t.region}
                  </div>
                  <div className="text-xs text-navy-500">{t.crop}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
