import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeatureCards } from "@/components/sections/feature-cards";
import { DeepDive } from "@/components/sections/deep-dive";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SocialProof } from "@/components/sections/social-proof";
import { FinalCta } from "@/components/sections/final-cta";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { OrnDivider } from "@/components/ui/orn-divider";
import { deepDives } from "@/content/deep-dives";

export default function Home() {
  return (
    <>
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
        <OrnDivider />
        <SocialProof />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
