import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeatureCards } from "@/components/sections/feature-cards";
import { DeepDive } from "@/components/sections/deep-dive";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { OrnDivider } from "@/components/ui/orn-divider";
import { deepDives } from "@/content/deep-dives";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Grano Agro",
  operatingSystem: "iOS, Android",
  applicationCategory: "BusinessApplication",
  description:
    "Застосунок для українських господарств: поля на карті, облік операцій, діагностика рослин за фото, замовлення насіння й засобів захисту.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <OrnDivider />
        {deepDives.map((d) => (
          <DeepDive key={d.id} data={d} />
        ))}
        <OrnDivider />
        <HowItWorks />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
