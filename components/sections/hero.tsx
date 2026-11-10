import { Check } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { Pill } from "@/components/ui/pill";
import { demoLabel, hero } from "@/content/landing";

export function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-cream-50">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-6">
          <Pill tone="green" className="self-start">{hero.pill}</Pill>
          <h1 className="font-display text-h1 font-bold tracking-tight text-navy-900 lg:text-[3.5rem]">{hero.title}</h1>
          <p className="max-w-xl text-lede text-navy-500">{hero.lede}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="#lead" size="lg">Залишити заявку</Button>
            <Button href="#start" size="lg" variant="ghost">Завантажити застосунок</Button>
          </div>
          <p className="max-w-xl text-sm text-navy-500">{hero.note}</p>
        </div>
        <div className="relative pb-12 lg:pr-10">
          <BrowserFrame {...hero.cabinet} priority sizes="(min-width: 1024px) 560px, 100vw" />
          <div className="absolute -bottom-4 right-0 hidden w-[130px] sm:block lg:w-[150px]">
            <IPhoneMockup src={hero.phone.src} alt={hero.phone.alt} className="border-[6px]" />
          </div>
          <p className="mt-3 text-xs text-navy-500">{demoLabel}</p>
        </div>
      </Container>
      <div className="border-t border-gray-200 bg-white">
        <Container className="flex flex-col gap-3 py-6 text-sm font-bold text-navy-700 md:flex-row md:items-center md:justify-between">
          {hero.trust.map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-700" aria-hidden="true" />
              {t}
            </span>
          ))}
        </Container>
      </div>
    </section>
  );
}
