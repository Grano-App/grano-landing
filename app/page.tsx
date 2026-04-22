import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeatureCards } from "@/components/sections/feature-cards";
import { OrnDivider } from "@/components/ui/orn-divider";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <OrnDivider />
      </main>
    </>
  );
}
