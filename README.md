# Grano Landing

Marketing landing for the Grano mobile app (Ukrainian farmers).

## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · Vitest · Playwright.

## Dev

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Tests

```bash
npm run typecheck       # TypeScript
npm run lint            # ESLint
npm test                # Vitest (content + component unit)
npm run test:e2e        # Playwright (E2E + axe accessibility)
```

## Content

All copy lives in `/content/*.ts`. Edit there — no CMS.

## Brand

Logo SVGs in `/public/brand/`. To update, edit the SVG files directly or replace with newer traces from Figma exports.

## Specs

- Design spec: [docs/superpowers/specs/2026-04-21-grano-landing-design.md](docs/superpowers/specs/2026-04-21-grano-landing-design.md)
- Implementation plan: [docs/superpowers/plans/2026-04-22-grano-landing-implementation.md](docs/superpowers/plans/2026-04-22-grano-landing-implementation.md)

## Known placeholders (replace before launch)

- `public/brand/logo.svg`, `public/brand/logo-dark.svg` — SVG traced from splash PNGs; letterforms are approximate. Replace with a precise SVG from the designer in Figma.
- `public/store-badges/app-store.svg`, `public/store-badges/google-play.svg` — generic black pills. Download the official Ukrainian-localized badges from Apple/Google design guidelines.
- `public/photos/hero-wheat-field.jpg` — currently a strawberries-on-straw Unsplash photo (blurred 40px so content is secondary). Replace with a wheat-field-at-sunset photo that matches brand tone.
- `app/privacy/page.tsx`, `app/terms/page.tsx` — placeholder legal copy with warning banner. Swap in final text from Grano legal team.
```
