import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BellRing, Check, Fuel, MapPinned, Monitor, Phone, Satellite, ShoppingCart,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AccordionItem } from "@/components/ui/accordion-item";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { Pill } from "@/components/ui/pill";
import { Section } from "@/components/ui/section";
import { StoreBadges } from "@/components/ui/store-badges";
import { cn } from "@/lib/cn";
import * as f from "./fixtures";

// BrowserFrame — прогалина кіту (README «Kit gaps»): рамка для скріншотів веб-кабінету.
function BrowserFrame({ src, alt, caption, priority, className }: {
  src: string; alt: string; caption?: string; priority?: boolean; className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div className="overflow-hidden rounded-[14px] border border-gray-200 bg-white shadow-mockup">
        <div className="flex h-7 items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
        </div>
        <Image src={src} alt={alt} width={1440} height={900} priority={priority} className="h-auto w-full" />
      </div>
      {caption && (
        <figcaption className="text-xs text-navy-500">
          {caption} · {f.demoLabel}
        </figcaption>
      )}
    </figure>
  );
}

function Bullets({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className={cn("flex items-start gap-3 text-base", tone === "dark" ? "text-navy-700" : "text-white/80")}>
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children, lede, center }: { children: React.ReactNode; lede?: string; center?: boolean }) {
  return (
    <div className={cn("mb-12 flex max-w-3xl flex-col gap-4", center && "mx-auto text-center")}>
      <h2 className="font-display text-h2 font-bold">{children}</h2>
      {lede && <p className="text-lede text-navy-500">{lede}</p>}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Link href="#top" aria-label="Grano — на початок"><Logo priority /></Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {f.nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-navy-700 hover:text-navy-900">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={f.phone.href} aria-label={`Зателефонувати ${f.phone.label}`} className="flex items-center gap-2 text-sm font-bold text-navy-900">
            <Phone className="h-5 w-5 text-green-700" aria-hidden="true" />
            <span className="hidden md:inline">{f.phone.label}</span>
          </a>
          <Button href="#lead" size="md" className="whitespace-nowrap px-4 md:px-5">
            <span className="md:hidden">Заявка</span>
            <span className="hidden md:inline">Залишити заявку</span>
          </Button>
        </div>
      </Container>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-cream-50">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-6">
          <Pill tone="green" className="self-start">{f.hero.pill}</Pill>
          <h1 className="font-display text-h1 font-bold tracking-tight text-navy-900 lg:text-[3.5rem]">{f.hero.title}</h1>
          <p className="max-w-xl text-lede text-navy-500">{f.hero.lede}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="#lead" size="lg">Залишити заявку</Button>
            <Button href="#start" size="lg" variant="ghost">Завантажити застосунок</Button>
          </div>
          <p className="max-w-xl text-sm text-navy-500">{f.hero.note}</p>
        </div>
        <div className="relative pb-12 lg:pr-10">
          <BrowserFrame src="/screens/cabinet/machine-card.png" alt="Веб-кабінет: картка трактора з пальним за нормою й фактом" priority />
          <div className="absolute -bottom-4 right-0 hidden w-[130px] sm:block lg:w-[150px]">
            <IPhoneMockup src="/screens/app/fields.png" alt="Застосунок: поля господарства" className="border-[6px]" />
          </div>
          <p className="mt-3 text-xs text-navy-500">{f.demoLabel}</p>
        </div>
      </Container>
      <div className="border-t border-gray-200 bg-white">
        <Container className="flex flex-col gap-3 py-6 text-sm font-bold text-navy-700 md:flex-row md:items-center md:justify-between">
          {f.hero.trust.map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-700" aria-hidden="true" />{t}
            </span>
          ))}
        </Container>
      </div>
    </section>
  );
}

export function Pains() {
  return (
    <Section id="pains" bg="white">
      <Container>
        <SectionTitle>{f.pains.title}</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {f.pains.items.map((p) => (
            <p key={p} className="rounded-card border border-gray-200 p-6 text-base text-navy-700">{p}</p>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-lede font-bold text-navy-900">{f.pains.outro}</p>
      </Container>
    </Section>
  );
}

const cycleIcons = { buy: ShoppingCart, fields: MapPinned, fuel: Fuel } as const;

export function Cycle() {
  return (
    <Section id="cycle" bg="cream">
      <Container>
        <SectionTitle center>{f.cycle.title}</SectionTitle>
        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {f.cycle.cards.map((c, i) => {
            const Icon = cycleIcons[c.id as keyof typeof cycleIcons];
            return (
              <li key={c.id} className="relative flex flex-col gap-4 rounded-card bg-white p-8 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-6 w-6 text-green-700" aria-hidden="true" />
                </span>
                <h3 className="text-h4 font-bold text-navy-900">{i + 1}. {c.title}</h3>
                <p className="text-base text-navy-700">{c.text}</p>
                {i < f.cycle.cards.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-green-700 lg:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base text-navy-700">{f.cycle.outro}</p>
      </Container>
    </Section>
  );
}

export function FuelBlock() {
  return (
    <Section id="fuel" bg="white">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <Pill tone="green" className="self-start">Техніка й пальне</Pill>
            <h2 className="font-display text-h2 font-bold">{f.fuel.title}</h2>
            <p className="text-lede text-navy-500">{f.fuel.lede}</p>
            <Bullets items={f.fuel.bullets} />
          </div>
          <div className="flex flex-col gap-8">
            {f.fuel.shots.map((s) => (
              <BrowserFrame key={s.src} src={s.src} alt={`Веб-кабінет: ${s.caption}`} caption={s.caption} />
            ))}
          </div>
        </div>
        <div className="mt-16 rounded-card bg-navy-900 p-8 text-white md:p-12">
          <h3 className="font-display text-h3 font-bold">{f.fuel.sensors.title}</h3>
          <p className="mt-4 max-w-3xl text-lede text-white/80">{f.fuel.sensors.text}</p>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Як працюють датчики">
            {[Satellite, Monitor, BellRing].map((Icon, i) => (
              <li key={f.fuel.sensors.steps[i]} className="relative flex items-center gap-4 rounded-card bg-white/5 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                  <Icon className="h-6 w-6 text-green-500" aria-hidden="true" />
                </span>
                <span className="text-base font-bold">{f.fuel.sensors.steps[i]}</span>
                {i < 2 && <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-green-500 md:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

function PhoneFeature({ id, bg, title, lede, bullets, phones, side, extra }: {
  id?: string; bg: "white" | "cream"; title: string; lede: string; bullets: string[];
  phones: { src: string; alt: string }[]; side: "left" | "right"; extra?: React.ReactNode;
}) {
  return (
    <Section id={id} bg={bg}>
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className={cn("order-2 flex justify-center gap-6", side === "left" ? "lg:order-1" : "lg:order-2")}>
          {phones.map((p, i) => (
            <div key={p.src} className={cn("w-full max-w-[260px]", i === 1 && "mt-16 hidden sm:block")}>
              <IPhoneMockup src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
        <div className={cn("order-1 flex flex-col gap-6", side === "left" ? "lg:order-2" : "lg:order-1")}>
          <h2 className="font-display text-h2 font-bold">{title}</h2>
          <p className="text-lede text-navy-500">{lede}</p>
          <Bullets items={bullets} />
          {extra}
        </div>
      </Container>
    </Section>
  );
}

export function Fields() {
  return (
    <PhoneFeature
      id="fields" bg="cream" side="left" title={f.fields.title} lede={f.fields.lede} bullets={f.fields.bullets} phones={f.fields.phones}
      extra={<BrowserFrame src={f.fields.cabinet.src} alt="Веб-кабінет: операції сезону" caption={f.fields.cabinet.caption} className="mt-4" />}
    />
  );
}

export function Shop() {
  return <PhoneFeature id="shop" bg="white" side="right" title={f.shop.title} lede={f.shop.lede} bullets={f.shop.bullets} phones={[f.shop.phone]} />;
}

export function Diagnosis() {
  return (
    <PhoneFeature
      id="diagnosis" bg="cream" side="left" title={f.diagnosis.title} lede={f.diagnosis.lede} bullets={f.diagnosis.bullets} phones={[f.diagnosis.phone]}
      extra={<p className="text-xs text-navy-500">На екрані: {f.diagnosis.caption}</p>}
    />
  );
}

export function About() {
  return (
    <Section id="about" bg="navy">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-h3 font-bold">{f.about.title}</h2>
          <p className="text-lede text-white/80">{f.about.text}</p>
          <a href={f.about.link.href} target="_blank" rel="noreferrer" className="self-start text-base font-bold text-green-500 underline">
            {f.about.link.label}
          </a>
        </div>
        <div>
          <p className="mb-4 text-sm text-white/60">У каталозі агрофірми</p>
          {/* Логотипи виробників — прогалина: потрібні файли логотипів. Поки назви. */}
          <ul className="flex flex-wrap gap-3">
            {f.about.brands.map((b) => (
              <li key={b} className="rounded-input border border-white/15 px-4 py-3 text-sm font-bold text-white/90">{b}</li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

export function Start() {
  return (
    <Section id="start" bg="white">
      <Container>
        <SectionTitle>{f.start.title}</SectionTitle>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {f.start.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-card border border-gray-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 font-display text-base font-bold text-white">{i + 1}</span>
              <h3 className="text-base font-bold text-navy-900">{s.title}</h3>
              <p className="text-sm text-navy-700">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-lede font-bold text-navy-900">{f.start.note}</p>
          <StoreBadges />
        </div>
      </Container>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="faq" bg="cream">
      <Container className="max-w-3xl">
        <SectionTitle center>Питання</SectionTitle>
        {f.faq.map((q) => <AccordionItem key={q.id} id={q.id} question={q.question} answer={q.answer} />)}
      </Container>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-900 py-14 text-white">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="text-sm text-white/60">{f.footer.tagline}</p>
          <StoreBadges />
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <p className="font-bold text-white">Продукт</p>
          {f.nav.map((n) => <a key={n.href} href={n.href} className="py-1 hover:text-white">{n.label}</a>)}
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <p className="font-bold text-white">Підтримка</p>
          <Link href="/support" className="py-1 hover:text-white">Центр підтримки</Link>
          <a href={f.phone.href} className="py-1 hover:text-white">{f.phone.label}</a>
          <a href={`mailto:${f.email}`} className="py-1 hover:text-white">{f.email}</a>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <p className="font-bold text-white">Компанія</p>
          <a href="https://grano.in.ua" target="_blank" rel="noreferrer" className="py-1 hover:text-white">grano.in.ua</a>
          <Link href="/privacy" className="py-1 hover:text-white">Політика конфіденційності</Link>
          <Link href="/terms" className="py-1 hover:text-white">Умови використання</Link>
        </div>
      </Container>
      <Container className="mt-10 text-xs text-white/50">© 2026 ТОВ Грано. Всі права захищені.</Container>
    </footer>
  );
}
