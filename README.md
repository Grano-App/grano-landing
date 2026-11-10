# Grano Landing

Marketing landing for Grano (grano-app.com): a farm-management system from the Grano agrofirm — mobile app, web cabinet, machinery and fuel accounting, purchasing. The page sells to farm owners and collects leads for the sales manager.

## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · Vitest · Playwright.

## Dev

```bash
npm install
cp .env.example .env    # then fill in the values, see «Environment»
npm run dev             # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

`next build` fails with «<Html> should not be imported outside of pages/_document» when the shell has `NODE_ENV=development`. Build with `NODE_ENV=production` (or unset it).

The site needs a Node server (`next start` or a Node-capable host): the lead form posts to the `/api/lead` route handler. A static export will not work.

## Environment

| Variable | Required | What it does |
| :-- | :-- | :-- |
| `TELEGRAM_BOT_TOKEN` | yes | Token of the bot that posts leads (@grano_app_bot), from @BotFather |
| `TELEGRAM_CHAT_ID` | yes | Chat where leads arrive: the managers' group or a personal chat with the bot |
| `NEXT_PUBLIC_GA_ID` | no | GA4 measurement ID (`G-…`). Without it no analytics script is loaded |

Without the Telegram variables `/api/lead` answers 503 and the form tells the visitor to call `+380 66 797 50 07`.

### Leads in Telegram

1. Add @grano_app_bot to the managers' group (or press Start in a private chat with it) and send any message there.
2. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` and take `message.chat.id` (groups have a negative id).
3. Put the token and the id into `.env` on the server and restart it.

Each lead arrives as a plain-text message: name, phone (normalized to `+380…`), farm, oblast, UTM tags of the visit and the page.

### Analytics and UTM

- GA4 events: `generate_lead` (form sent), `click_phone` (any `tel:` link, `location` = header/footer), `click_store` (store badges, `label` = store and placement).
- UTM tags of the first page view (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are kept for the browser session and sent with the lead. Put dealer- and mailing-specific tags on every link and QR code that leads to the site, e.g. `https://grano-app.com/?utm_source=dealer-17&utm_medium=qr`.
- Google Play links carry `referrer=utm_source=grano-app.com&utm_medium=landing&utm_content=<placement>` for Play Console install attribution.

## Tests

```bash
npm run typecheck                                 # TypeScript
npx vitest run --maxWorkers=4 --minWorkers=1      # Vitest: lead validation, /api/lead, content, components
NODE_ENV=production npm run test:e2e              # Playwright (E2E + axe); builds and starts the site
E2E_PORT=3457 NODE_ENV=production npm run test:e2e  # when port 3000 is taken
```

## Content

All copy lives in `/content/*.ts` (`landing.ts` for the homepage sections, `faq.ts`, `site.ts` for contacts and store links). Edit there — no CMS. The approved source text is `docs/design/2026-11-10-landing-relaunch/copy.md`.

Screenshots: `public/screens/cabinet/*` (web cabinet) and `public/screens/app/*` (app), taken on a demo farm — every cabinet screenshot is captioned «Демонстраційні дані».

## Content rules

Every claim on the site must exist in the current build or be an approved release feature (see the relaunch spec, §3.3). No invented testimonials, statistics or contacts. FaynoSoft is never mentioned publicly.

## Brand

- `public/brand/grano-logo.png` — Grano logo from grano.in.ua (for light backgrounds); `grano-logo-white.png` — the same artwork with white letters (for dark backgrounds).
- `public/brands/*.png` — manufacturer logos from grano.in.ua for the «Хто за Grano» block.

## Specs

- Design spec: [docs/superpowers/specs/2026-04-21-grano-landing-design.md](docs/superpowers/specs/2026-04-21-grano-landing-design.md)
- Implementation plan: [docs/superpowers/plans/2026-04-22-grano-landing-implementation.md](docs/superpowers/plans/2026-04-22-grano-landing-implementation.md)
- Relaunch (positioning, structure, stages 0–3): [docs/superpowers/specs/2026-11-10-landing-relaunch.md](docs/superpowers/specs/2026-11-10-landing-relaunch.md)
- New homepage design: [docs/design/2026-11-10-landing-relaunch/README.md](docs/design/2026-11-10-landing-relaunch/README.md)

## Known placeholders (replace before launch)

- `public/store-badges/app-store.svg`, `public/store-badges/google-play.svg` — generic black pills. Download the official Ukrainian-localized badges from Apple/Google design guidelines.
- `app/privacy/page.tsx`, `app/terms/page.tsx` — placeholder legal copy with warning banner. Final text comes from the Grano partner; it must cover machinery geodata from telematics and the lead form (name, phone, farm, oblast sent to Telegram).
- Grano logo is a raster PNG; replace with a vector file when the designer provides one.
