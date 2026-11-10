import { ArrowRight, Fuel, MapPinned, ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { cycle } from "@/content/landing";

const icons = { buy: ShoppingCart, fields: MapPinned, fuel: Fuel } as const;

export function Cycle() {
  return (
    <Section id="cycle" bg="cream">
      <Container>
        <SectionTitle center>{cycle.title}</SectionTitle>
        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cycle.cards.map((card, i) => {
            const Icon = icons[card.id];
            return (
              <li key={card.id} className="relative flex flex-col gap-4 rounded-card bg-white p-8 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-6 w-6 text-green-700" aria-hidden="true" />
                </span>
                <h3 className="text-h4 font-bold text-navy-900">{i + 1}. {card.title}</h3>
                <p className="text-base text-navy-700">{card.text}</p>
                {i < cycle.cards.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-green-700 lg:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base text-navy-700">{cycle.outro}</p>
      </Container>
    </Section>
  );
}
