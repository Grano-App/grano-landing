import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Pill } from "@/components/ui/pill";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { StoreBadges } from "@/components/ui/store-badges";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section id="download" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/photos/hero-wheat-field.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-[40px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white" />
      </div>
      <Container className="grid min-h-[80vh] grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:py-[120px]">
        <div className="flex flex-col gap-6">
          <Pill tone="green">Для українських фермерів</Pill>
          <h1 className="font-display text-h1 font-bold tracking-tight text-navy-900">
            {site.tagline}
          </h1>
          <p className="max-w-xl text-lede text-navy-500">
            Управляйте полями, діагностуйте хвороби рослин і замовляйте насіння —
            все в одному застосунку.
          </p>
          <StoreBadges className="mt-2" />
        </div>
        <div className="flex justify-center md:justify-end">
          <IPhoneMockup
            src="/screens/home.png"
            alt="Головний екран додатку Grano"
            priority
          />
        </div>
      </Container>
    </section>
  );
}
