import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Logo } from "@/components/brand/logo";
import { StoreBadges } from "@/components/ui/store-badges";

export function FinalCta() {
  return (
    <Section bg="navy" className="relative">
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-green-500/20"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-green-500/20"
      />
      <Container className="flex flex-col items-center gap-8 text-center">
        <Logo variant="dark" />
        <h2 className="font-display text-h2 font-bold text-white">
          Grano — в твоєму телефоні
        </h2>
        <p className="text-lede text-white/70">
          Реєстрація й перший місяць — безкоштовно.
        </p>
        <StoreBadges />
      </Container>
    </Section>
  );
}
