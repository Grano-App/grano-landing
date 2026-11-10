import { About } from "@/components/sections/about";
import { Cycle } from "@/components/sections/cycle";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { FuelSection } from "@/components/sections/fuel";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { LeadForm } from "@/components/sections/lead-form";
import { Pains } from "@/components/sections/pains";
import { PhoneFeature } from "@/components/sections/phone-feature";
import { Start } from "@/components/sections/start";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { demoLabel, diagnosis, fields, leadForm, shop } from "@/content/landing";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Grano Agro",
  operatingSystem: "iOS, Android",
  applicationCategory: "BusinessApplication",
  description: site.description,
  publisher: { "@type": "Organization", name: site.company, url: site.mainSite },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Pains />
        <Cycle />
        <FuelSection />
        <PhoneFeature
          id="fields"
          bg="cream"
          side="left"
          title={fields.title}
          lede={fields.lede}
          bullets={fields.bullets}
          phones={fields.phones}
          extra={<BrowserFrame {...fields.cabinet} caption={`${fields.cabinet.caption} · ${demoLabel}`} className="mt-4" />}
        />
        <PhoneFeature id="shop" bg="white" side="right" title={shop.title} lede={shop.lede} bullets={shop.bullets} phones={[shop.phone]} />
        <PhoneFeature
          id="diagnosis"
          bg="cream"
          side="left"
          title={diagnosis.title}
          lede={diagnosis.lede}
          bullets={diagnosis.bullets}
          phones={[diagnosis.phone]}
          extra={<p className="text-xs text-navy-500">{diagnosis.caption}</p>}
        />
        <About />
        <Start />
        <Faq />
        <Section id="lead" bg="white">
          <Container className="max-w-3xl">
            <h2 className="mb-10 text-center font-display text-h2 font-bold">{leadForm.title}</h2>
            <LeadForm />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
