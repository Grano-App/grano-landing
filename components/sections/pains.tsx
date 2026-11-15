import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { pains } from "@/content/landing";

export function Pains() {
  return (
    <Section id="pains" bg="white">
      <Container>
        <SectionTitle>{pains.title}</SectionTitle>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pains.items.map((p, i) => (
            <li
              key={p}
              className="group flex h-full min-h-[140px] items-start gap-4 rounded-card border border-gray-200 bg-gray-50 p-6 transition duration-200 hover:border-green-700 hover:bg-white hover:shadow-lg motion-safe:hover:-translate-y-1"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700/10 font-display text-lg font-bold text-green-700 transition group-hover:bg-green-700 group-hover:text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="text-base text-navy-700">{p}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-lede font-bold text-navy-900">{pains.outro}</p>
      </Container>
    </Section>
  );
}
