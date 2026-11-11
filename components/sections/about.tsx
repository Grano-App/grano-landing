import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { about } from "@/content/landing";

export function About() {
  return (
    <Section id="about" bg="navy">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-h3 font-bold">{about.title}</h2>
          <p className="text-lede text-white/80">{about.text}</p>
          <a href={about.link.href} target="_blank" rel="noreferrer" className="self-start text-base font-bold text-green-500 underline">
            {about.link.label}
          </a>
        </div>
        <div>
          <p className="mb-4 text-sm text-white/60">{about.brandsLabel}</p>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {about.brands.map((brand) => (
              <li key={brand.name} className="flex aspect-square items-center justify-center rounded-input bg-white p-3">
                <Image src={brand.logo} alt={brand.name} width={200} height={200} className="h-auto w-full" sizes="96px" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
