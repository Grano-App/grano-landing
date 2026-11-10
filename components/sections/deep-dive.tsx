import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { cn } from "@/lib/cn";
import type { DeepDive as DeepDiveData } from "@/content/deep-dives";

export function DeepDive({ data }: { data: DeepDiveData }) {
  const { mockupSide, bg, title, lede, bullets, screenSrc, alt } = data;
  const mockupFirst = mockupSide === "left";
  return (
    <Section id={data.id} bg={bg}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className={cn("flex justify-center", mockupFirst ? "md:order-1" : "md:order-2")}>
            <IPhoneMockup src={screenSrc} alt={alt} />
          </div>
          <div className={cn("flex flex-col gap-6", mockupFirst ? "md:order-2" : "md:order-1")}>
            <h3 className="font-display text-h3 font-bold text-navy-900">{title}</h3>
            <p className="text-lede text-navy-700">{lede}</p>
            <ul className="flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-base text-navy-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
