import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { steps } from "@/content/how-it-works";

export function HowItWorks() {
  return (
    <Section id="how-it-works" bg="white">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-h2 font-bold text-navy-900">
            Як почати — три кроки
          </h2>
          <p className="mt-4 text-lede text-navy-500">
            Менше 5 хвилин до повного налаштування господарства.
          </p>
        </div>
        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px border-t border-dashed border-gray-200 md:block"
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.index}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                    {step.index}
                  </span>
                  <Icon className="h-10 w-10 text-green-700" aria-hidden="true" />
                </div>
                <h3 className="text-h4 font-bold text-navy-900">{step.title}</h3>
                <p className="max-w-xs text-sm text-navy-500">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
