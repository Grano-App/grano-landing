import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { form, formStates, type FormState } from "./fixtures";
import { LeadForm } from "./lead-form";
import {
  About, Cycle, Diagnosis, Faq, Fields, Footer, FuelBlock, Header, Hero, Pains, Shop, Start,
} from "./sections";

// Прототип нової головної: /__design/landing-relaunch/home?state=idle|invalid|sending|sent|error
// Стан стосується форми заявки; решта сторінки статична. Лише для розробки.

export const metadata: Metadata = {
  title: "Прототип: нова головна",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { state } = await searchParams;
  const formState: FormState = formStates.includes(state as FormState) ? (state as FormState) : "idle";

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pains />
        <Cycle />
        <FuelBlock />
        <Fields />
        <Shop />
        <Diagnosis />
        <About />
        <Start />
        <Faq />
        <Section id="lead" bg="white">
          <Container className="max-w-3xl">
            <h2 className="mb-10 text-center font-display text-h2 font-bold">{form.title}</h2>
            <LeadForm key={formState} initial={formState} />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
