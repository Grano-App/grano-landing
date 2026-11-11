import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  bg: "white" | "cream";
  title: string;
  lede: string;
  bullets: readonly string[];
  phones: readonly { src: string; alt: string }[];
  /** Де стоять телефони на десктопі. На мобільному текст завжди перед ними. */
  side: "left" | "right";
  extra?: React.ReactNode;
};

/** Блок «текст + екрани застосунку»: поля й роботи, закупівля, діагностика. */
export function PhoneFeature({ id, bg, title, lede, bullets, phones, side, extra }: Props) {
  return (
    <Section id={id} bg={bg}>
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className={cn("order-2 flex justify-center gap-6", side === "left" ? "lg:order-1" : "lg:order-2")}>
          {phones.map((phone, i) => (
            <div key={phone.src} className={cn("w-full max-w-[260px]", i > 0 && "mt-16 hidden sm:block")}>
              <IPhoneMockup src={phone.src} alt={phone.alt} />
            </div>
          ))}
        </div>
        <div className={cn("order-1 flex flex-col gap-6", side === "left" ? "lg:order-2" : "lg:order-1")}>
          <h2 className="font-display text-h2 font-bold">{title}</h2>
          <p className="text-lede text-navy-500">{lede}</p>
          <CheckList items={bullets} />
          {extra}
        </div>
      </Container>
    </Section>
  );
}
