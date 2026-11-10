import { ArrowRight, BellRing, Monitor, Satellite } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Pill } from "@/components/ui/pill";
import { Section } from "@/components/ui/section";
import { demoLabel, fuel } from "@/content/landing";

const sensorIcons = [Satellite, Monitor, BellRing];

export function FuelSection() {
  return (
    <Section id="fuel" bg="white">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <Pill tone="green" className="self-start">{fuel.pill}</Pill>
            <h2 className="font-display text-h2 font-bold">{fuel.title}</h2>
            <p className="text-lede text-navy-500">{fuel.lede}</p>
            <CheckList items={fuel.bullets} />
          </div>
          <div className="flex flex-col gap-8">
            {fuel.shots.map((shot) => (
              <BrowserFrame key={shot.src} {...shot} caption={`${shot.caption} · ${demoLabel}`} />
            ))}
          </div>
        </div>
        <div className="mt-16 rounded-card bg-navy-900 p-8 text-white md:p-12">
          <h3 className="font-display text-h3 font-bold">{fuel.sensors.title}</h3>
          <p className="mt-4 max-w-3xl text-lede text-white/80">{fuel.sensors.text}</p>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Як працюють датчики">
            {fuel.sensors.steps.map((step, i) => {
              const Icon = sensorIcons[i];
              return (
                <li key={step} className="relative flex items-center gap-4 rounded-card bg-white/5 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <Icon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </span>
                  <span className="text-base font-bold">{step}</span>
                  {i < fuel.sensors.steps.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-green-500 md:block" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
