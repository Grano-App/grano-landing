import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { features } from "@/content/features";

export function FeatureCards() {
  return (
    <Section id="features" bg="white">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-h2 font-bold text-navy-900">
            Все, що потрібно агроному в одному додатку
          </h2>
          <p className="mt-4 text-lede text-navy-500">
            Чотири ключові можливості Grano — в інтерфейсі, який зрозуміє будь-який фермер.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.id}
                className="group flex flex-col gap-4 rounded-card bg-white p-6 shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-mockup"
              >
                <Icon className="h-12 w-12 text-green-700" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <h3 className="text-h4 font-bold text-navy-900">{f.title}</h3>
                  {f.comingSoon && <Pill tone="warning">Скоро</Pill>}
                </div>
                <p className="text-sm text-navy-500">{f.description}</p>
                <div className="relative mt-auto aspect-[10/16] overflow-hidden rounded-[12px] bg-cream-50">
                  <Image
                    src={f.screenSrc}
                    alt={`Скріншот розділу «${f.title}»`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 90vw"
                    className="object-cover object-top"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
