# Grano Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Ukrainian-language marketing landing for Grano (mobile app for Ukrainian farmers) at `grano-app.com`, satisfying both farmer-conversion goals and Apple/Google store review requirements.

**Architecture:** Static Next.js 15 App Router site (SSG, no server runtime), Tailwind v4 CSS-first theming, content in typed TS modules, brand/screen assets served from `/public`. Single homepage + three compliance sub-pages (`/privacy`, `/terms`, `/support`). Interactive pieces limited to sticky header, FAQ accordion, and mobile menu. Full spec: [docs/superpowers/specs/2026-04-21-grano-landing-design.md](../specs/2026-04-21-grano-landing-design.md).

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · `next/font` · Lucide React · Vitest · @testing-library/react · Playwright (E2E smoke).

**Working directory:** `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/` (Next.js app lives at project root).

---

## File Structure

```
landing/                              (project root, also Next.js root)
├── .gitignore
├── BUSINESS_LOGIC.md                (existing — kept for dev reference)
├── app-BUSINESS_LOGIC.md            (existing)
├── general-info.md                  (existing)
├── Screenshot 2026-04-21 at 22.44.44.png  (existing)
├── Дизайн/                          (existing — screen sources, gitignored)
├── docs/superpowers/
│   ├── specs/2026-04-21-grano-landing-design.md
│   └── plans/2026-04-22-grano-landing-implementation.md
├── app/                             (NEW — Next.js App Router)
│   ├── layout.tsx                   root layout, fonts, metadata defaults
│   ├── page.tsx                     homepage (assembles sections)
│   ├── globals.css                  Tailwind v4 @theme + base styles
│   ├── icon.tsx                     favicon generator
│   ├── apple-icon.tsx               Apple touch icon
│   ├── opengraph-image.tsx          OG image generator
│   ├── privacy/page.tsx             /privacy
│   ├── terms/page.tsx               /terms
│   ├── support/page.tsx             /support
│   ├── sitemap.ts                   sitemap.xml
│   └── robots.ts                    robots.txt
├── components/
│   ├── sections/
│   │   ├── header.tsx               sticky site header
│   │   ├── hero.tsx                 hero with mockup + bg
│   │   ├── feature-cards.tsx        4-card features grid
│   │   ├── deep-dive.tsx            one reusable zig-zag section component
│   │   ├── how-it-works.tsx         3-step timeline
│   │   ├── social-proof.tsx         stats + testimonials
│   │   ├── final-cta.tsx            dark navy CTA banner
│   │   ├── faq.tsx                  FAQ accordion
│   │   └── footer.tsx               site footer
│   ├── ui/
│   │   ├── container.tsx            max-width wrapper
│   │   ├── button.tsx               pill CTA button
│   │   ├── pill.tsx                 small rounded badge (for "Скоро" etc.)
│   │   ├── section.tsx              consistent section padding/theme
│   │   ├── orn-divider.tsx          Ukrainian embroidery SVG divider
│   │   ├── store-badges.tsx         App Store + Google Play badges
│   │   ├── iphone-mockup.tsx        device frame for screens
│   │   └── accordion-item.tsx       single-open FAQ accordion item (client)
│   └── brand/
│       ├── logo.tsx                 Grano wordmark (variant prop: light/dark)
│       └── logo-icon.tsx            leaf-only mark (for favicon fallback)
├── content/
│   ├── nav.ts                       header + footer nav links
│   ├── features.ts                  4 feature cards copy
│   ├── deep-dives.ts                4 deep-dive section copy
│   ├── how-it-works.ts              3 steps
│   ├── testimonials.ts              3 placeholder testimonials
│   ├── stats.ts                     4 top stats
│   ├── faq.ts                       6 FAQ items
│   ├── footer.ts                    footer column data
│   └── site.ts                      site-wide constants (url, email, phone)
├── lib/
│   ├── fonts.ts                     next/font setup (Comfortaa + e-Ukraine Head)
│   ├── metadata.ts                  buildMetadata helper
│   └── cn.ts                        clsx helper
├── public/
│   ├── brand/
│   │   ├── logo.svg                 navy wordmark + green leaf
│   │   ├── logo-dark.svg            white wordmark + green leaf
│   │   ├── favicon.ico
│   │   └── og-image.png             generated once, 1200×630
│   ├── fonts/e-ukraine-head/        self-hosted WOFF2 files
│   │   ├── e-UkraineHead-Medium.woff2
│   │   └── e-UkraineHead-Bold.woff2
│   ├── screens/                     cropped PNG exports from Дизайн/
│   │   ├── home.png
│   │   ├── fields-list.png
│   │   ├── field-detail.png
│   │   ├── shop-catalog.png
│   │   ├── cart.png
│   │   ├── ai-result.png
│   │   └── weather-card.png
│   ├── store-badges/
│   │   ├── app-store.svg            official Apple badge (Ukrainian)
│   │   └── google-play.svg          official Google badge (Ukrainian)
│   └── photos/
│       └── hero-wheat-field.jpg     licensed Unsplash photo
├── tests/
│   ├── content/                     vitest content-module unit tests
│   │   ├── faq.test.ts
│   │   ├── features.test.ts
│   │   └── testimonials.test.ts
│   ├── components/
│   │   └── accordion-item.test.tsx  @testing-library/react test
│   └── e2e/
│       └── landing.spec.ts          Playwright smoke
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

**Key boundaries:**
- `content/` = pure data, typed, no React. All copy lives here so non-devs can edit.
- `components/ui/*` = dumb/reusable primitives.
- `components/sections/*` = page composition. Each section imports its own content slice and ui primitives only.
- `components/brand/*` = logo/brand marks only.
- `lib/*` = stateless helpers.
- Single `deep-dive.tsx` is reused 4× with different content props — avoids 4 near-identical section files.

---

## Testing Strategy

This is a static marketing page. Heavy TDD per layout component would be performative. The plan uses tests where they catch real regressions:

- **Content modules** (vitest) — assert shape, completeness, counts. Catches content drift.
- **Interactive components** (@testing-library/react) — FAQ accordion keyboard behavior and aria. Catches interaction bugs.
- **E2E smoke** (Playwright) — page loads, nav links work, store badges link to correct URLs, `/privacy` & `/terms` reachable. Catches integration bugs.
- **Layout sections** — no automated tests. Visual review in browser + Lighthouse pass.

Accessibility is verified at end via `@axe-core/playwright` inside the E2E smoke.

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Verify working directory is empty of Next.js files**

Run:
```bash
ls /Users/oleksiimotornyi/Documents/Projects/Grano/landing/ | grep -E '^(package\.json|next\.config|app)$' || echo "clean"
```
Expected: `clean`

- [ ] **Step 2: Initialize git repo**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git init && git branch -m main
```
Expected: `Initialized empty Git repository ...`

- [ ] **Step 3: Create `.gitignore`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/.gitignore`
```gitignore
# Dependencies
node_modules/
.pnp.*

# Next.js
.next/
out/
next-env.d.ts

# Production
/build

# Misc
.DS_Store
*.log
.env*.local
.env

# IDE
.vscode/
.idea/

# Testing
coverage/
playwright-report/
test-results/

# Design source (kept locally, not tracked)
Дизайн/
Screenshot*.png
```

- [ ] **Step 4: Create `package.json` manually (we skip `create-next-app` to avoid interactive prompts and keep control over deps)**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/package.json`
```json
{
  "name": "grano-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@axe-core/playwright": "^4.10.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 5: Install deps**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm install
```
Expected: success, `node_modules/` created, no peer-dep errors. If `tailwindcss@^4` is not yet released (still RC at time of implementation), pin to `tailwindcss@next` and `@tailwindcss/postcss@next`.

- [ ] **Step 6: Create `tsconfig.json`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 7: Create `next.config.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

- [ ] **Step 8: Create `postcss.config.mjs`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/postcss.config.mjs`
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 9: Create placeholder `app/layout.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/layout.tsx`
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grano — твій цифровий агроном",
  description:
    "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння. Безкоштовно.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder `app/page.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
export default function Home() {
  return <main className="p-8 font-sans">Grano landing — in progress.</main>;
}
```

- [ ] **Step 11: Create placeholder `app/globals.css`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/globals.css`
```css
@import "tailwindcss";

html {
  text-size-adjust: 100%;
}
```

- [ ] **Step 12: Verify build works**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run build
```
Expected: Build completes, outputs `.next/`, no TS or runtime errors.

- [ ] **Step 13: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "chore: initialize Next.js 15 + Tailwind v4 + TS scaffold"
```

---

## Task 2: Setup Fonts (Comfortaa + e-Ukraine Head)

**Files:**
- Create: `lib/fonts.ts`
- Create: `public/fonts/e-ukraine-head/` (two WOFF2 files to be downloaded manually)
- Modify: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Download e-Ukraine Head WOFF2 files manually**

The e-Ukraine font family is distributed as TTF/OTF from https://www.e-ukraine.in.ua/. Download the **Head** subfamily (NOT the regular "e-Ukraine"). Convert to WOFF2 using `fonttools` or https://transfonter.org/:

Required files in `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/public/fonts/e-ukraine-head/`:
- `e-UkraineHead-Medium.woff2` (weight 500)
- `e-UkraineHead-Bold.woff2` (weight 700)

This is a human step. If the files are not available, STOP and ask the user to provide them before continuing. Do NOT proceed with a fallback font — the display font is a locked-in design decision.

- [ ] **Step 2: Create `lib/fonts.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/lib/fonts.ts`
```typescript
import { Comfortaa } from "next/font/google";
import localFont from "next/font/local";

export const comfortaa = Comfortaa({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

export const eUkraineHead = localFont({
  src: [
    {
      path: "../public/fonts/e-ukraine-head/e-UkraineHead-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/e-ukraine-head/e-UkraineHead-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-display",
});
```

- [ ] **Step 3: Apply fonts in `app/layout.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/layout.tsx`
```typescript
import type { Metadata } from "next";
import { comfortaa, eUkraineHead } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grano — твій цифровий агроном",
  description:
    "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння. Безкоштовно.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${comfortaa.variable} ${eUkraineHead.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Register font tokens in `app/globals.css`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/globals.css`
```css
@import "tailwindcss";

@theme {
  --font-body: var(--font-body), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
}

html {
  text-size-adjust: 100%;
}
```

- [ ] **Step 5: Verify dev server renders fonts**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run dev
```
Open `http://localhost:3000`. Inspect the placeholder text — it should render in Comfortaa (rounded). Kill the server.
Expected: no font-related console errors, text visibly Comfortaa.

- [ ] **Step 6: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(fonts): wire Comfortaa (body) + e-Ukraine Head (display)"
```

---

## Task 3: Design Tokens (colors, typography, radii, shadows)

**Files:**
- Modify: `app/globals.css`

Spec refs: §4 Color System, §5 Typography scale, §6 Layout/Radii/Shadows.

- [ ] **Step 1: Replace `app/globals.css` with full token system**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/globals.css`
```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-body: var(--font-body), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;

  /* Brand — navy */
  --color-navy-900: #1E2E3E;
  --color-navy-700: #243447;
  --color-navy-500: #3A4F63;

  /* Brand — green */
  --color-green-50:  #EEF6E4;
  --color-green-500: #85C059;
  --color-green-600: #6FA847;
  --color-green-700: #3A8E3E;

  /* Neutrals */
  --color-cream-50: #FAF8F3;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-400: #9CA3AF;
  --color-gray-600: #4B5563;

  /* Semantic */
  --color-danger:     #D44040;
  --color-danger-bg:  #F7DEE0;
  --color-warning:    #E7962C;
  --color-warning-bg: #FCE7CE;

  /* Type scale (desktop) */
  --text-h1: 4rem;       /* 64px */
  --text-h1--line-height: 1.05;
  --text-h2: 3rem;       /* 48px */
  --text-h2--line-height: 1.1;
  --text-h3: 2rem;       /* 32px */
  --text-h3--line-height: 1.2;
  --text-h4: 1.375rem;   /* 22px */
  --text-h4--line-height: 1.3;
  --text-lede: 1.25rem;  /* 20px */
  --text-lede--line-height: 1.5;

  /* Radii */
  --radius-pill: 999px;
  --radius-card: 20px;
  --radius-input: 16px;

  /* Shadows */
  --shadow-card: 0 4px 16px rgba(30, 46, 62, 0.06);
  --shadow-mockup: 0 24px 64px -16px rgba(30, 46, 62, 0.2);
  --shadow-cta: 0 8px 20px rgba(133, 192, 89, 0.3);

  /* Container */
  --container-max: 1200px;
}

html {
  text-size-adjust: 100%;
}

body {
  color: var(--color-navy-900);
  background: #ffffff;
}

/* Mobile type scale override */
@media (max-width: 767px) {
  :root {
    --text-h1: 2.5rem;    /* 40px */
    --text-h2: 2rem;      /* 32px */
    --text-h3: 1.5rem;    /* 24px */
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus ring — WCAG */
:focus-visible {
  outline: 2px solid var(--color-green-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Sanity check — swap `app/page.tsx` placeholder to exercise tokens**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
export default function Home() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="font-display text-h1 text-navy-900">Твій цифровий агроном</h1>
      <p className="text-lede text-navy-500">
        Перевірка типографіки та токенів.
      </p>
      <button className="rounded-pill bg-green-500 px-6 py-3 text-white shadow-cta">
        Скачати
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Run dev + verify visually**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run dev
```
Open `http://localhost:3000`. Verify: H1 in e-Ukraine Head bold, body in Comfortaa, button pill-shaped with green (#85C059) bg and soft green glow shadow. Kill server.

- [ ] **Step 4: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(theme): add full Tailwind v4 token system (colors, type, radii, shadows)"
```

---

## Task 4: Brand Logo SVG + Favicons + OG Image

**Files:**
- Create: `public/brand/logo.svg`, `public/brand/logo-dark.svg`, `public/brand/favicon.ico`
- Create: `components/brand/logo.tsx`
- Create: `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`

- [ ] **Step 1: Hand-trace logo SVG from splash PNGs**

Source: `landing/Дизайн/Screenshot 2026-04-21 at 23.13.41.png` (dark variant) and `.../23.14.24.png` (light variant). The logo is the word "GRAN" followed by a stylized leaf replacing the "O".

Create `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/public/brand/logo.svg` (light variant — navy wordmark + green leaf, for use on light backgrounds):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 72" role="img" aria-label="Grano">
  <text x="0" y="54" font-family="Comfortaa, sans-serif" font-size="56" font-weight="700" letter-spacing="-1" fill="#1E2E3E">GRAN</text>
  <!-- Leaf replacing "O" — simplified 2-lobe leaf -->
  <g transform="translate(168 14)">
    <path d="M28 6 C 40 8, 48 22, 42 38 C 38 48, 26 52, 16 46 C 10 42, 8 36, 10 28 Z" fill="#85C059"/>
    <path d="M14 30 C 22 28, 32 22, 40 14" stroke="#3A8E3E" stroke-width="1.5" fill="none" opacity="0.6"/>
  </g>
</svg>
```

Create `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/public/brand/logo-dark.svg` (dark variant — white wordmark + green leaf, for dark backgrounds). Same as above but `fill="#FFFFFF"` on the text.

**Calibration requirement:** After creating these, visually compare to the splash PNGs side-by-side in a browser. If letterforms look off (Comfortaa is not a perfect match for the custom Grano wordmark), convert the text to path data using Figma or Inkscape and paste the resulting `<path>` elements. The goal is a wordmark that visually matches the splash, not a faithful font render.

- [ ] **Step 2: Create `components/brand/logo.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/brand/logo.tsx`
```typescript
import Image from "next/image";

type Props = {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = "light", className, priority }: Props) {
  const src = variant === "dark" ? "/brand/logo-dark.svg" : "/brand/logo.svg";
  return (
    <Image
      src={src}
      alt="Grano"
      width={160}
      height={48}
      priority={priority}
      className={className}
    />
  );
}
```

- [ ] **Step 3: Create `app/icon.tsx` (favicon generator)**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/icon.tsx`
```typescript
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E2E3E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: "#85C059",
            borderRadius: "0 100% 0 100%",
            transform: "rotate(-20deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Create `app/apple-icon.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/apple-icon.tsx`
```typescript
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E2E3E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            background: "#85C059",
            borderRadius: "0 100% 0 100%",
            transform: "rotate(-20deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 5: Create `app/opengraph-image.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/opengraph-image.tsx`
```typescript
import { ImageResponse } from "next/og";

export const alt = "Grano — твій цифровий агроном";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E2E3E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -2,
          }}
        >
          Grano
        </div>
        <div
          style={{
            fontSize: 48,
            color: "#9CA8B4",
            marginTop: 24,
          }}
        >
          Твій цифровий агроном
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 6: Test icons and OG**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run dev
```
Visit:
- `http://localhost:3000/icon` → 32×32 PNG with navy bg + green leaf shape
- `http://localhost:3000/apple-icon` → 180×180 version
- `http://localhost:3000/opengraph-image` → 1200×630 branded card

Expected: all three render, no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(brand): add logo SVG (light/dark), favicon, apple-icon, OG image"
```

---

## Task 5: Content Modules with Tests

**Files:**
- Create: `content/site.ts`, `content/nav.ts`, `content/features.ts`, `content/deep-dives.ts`, `content/how-it-works.ts`, `content/testimonials.ts`, `content/stats.ts`, `content/faq.ts`, `content/footer.ts`
- Create: `tests/content/faq.test.ts`, `tests/content/features.test.ts`, `tests/content/testimonials.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/vitest.config.ts`
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
```

- [ ] **Step 2: Write failing test for FAQ content completeness**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/content/faq.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import { faqItems } from "@/content/faq";

describe("faqItems", () => {
  it("has exactly 6 items per spec §8.8", () => {
    expect(faqItems).toHaveLength(6);
  });

  it("each item has Ukrainian question and answer text", () => {
    for (const item of faqItems) {
      expect(item.question).toMatch(/^[А-ЯЇІЄҐ].+[?]$/u);
      expect(item.answer.length).toBeGreaterThan(40);
    }
  });

  it("each item has unique id", () => {
    const ids = faqItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 3: Run test, verify failure**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/faq.test.ts
```
Expected: FAIL — `Cannot find module '@/content/faq'`.

- [ ] **Step 4: Create `content/faq.ts` with the 6 FAQ items from spec §8.8**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/faq.ts`
```typescript
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "free",
    question: "Чи додаток безкоштовний?",
    answer:
      "Так, Grano безкоштовний для всіх користувачів. Ви платите тільки за товари, які замовляєте в магазині.",
  },
  {
    id: "devices",
    question: "На яких телефонах працює Grano?",
    answer:
      "iPhone з iOS 13+ і Android 8.0+. Для більш старих пристроїв функціональність обмежена.",
  },
  {
    id: "offline",
    question: "Чи можна використовувати офлайн?",
    answer:
      "Так, основні функції (перегляд полів, завдань, нагадування) працюють офлайн. Магазин, AI-діагностика і погода потребують інтернету.",
  },
  {
    id: "ai",
    question: "Як працює AI-діагностика?",
    answer:
      "Ви фотографуєте уражений листок — AI аналізує фото, визначає ймовірну проблему і пропонує план обробки. Повна версія функції з'явиться в 2026 році.",
  },
  {
    id: "shop-order",
    question: "Як оформити замовлення в магазині?",
    answer:
      "Обираєте товар → додаєте в кошик → обираєте спосіб доставки (кур'єр або Нова пошта) → оплачуєте онлайн або післяплатою.",
  },
  {
    id: "support",
    question: "Як зв'язатись з підтримкою?",
    answer:
      "Напишіть на support@grano-app.com або зателефонуйте +380 44 123 45 67 (Пн–Пт 9:00–18:00). Також доступний розділ «Підтримка» в додатку.",
  },
];
```

- [ ] **Step 5: Run test, verify pass**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/faq.test.ts
```
Expected: PASS, 3/3.

- [ ] **Step 6: Write failing test for features**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/content/features.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import { features } from "@/content/features";

describe("features", () => {
  it("has exactly 4 items per spec §8.3", () => {
    expect(features).toHaveLength(4);
  });

  it("AI diagnostics card is marked as coming soon", () => {
    const ai = features.find((f) => f.id === "ai");
    expect(ai?.comingSoon).toBe(true);
  });

  it("non-AI features are NOT marked coming soon", () => {
    const others = features.filter((f) => f.id !== "ai");
    for (const f of others) {
      expect(f.comingSoon ?? false).toBe(false);
    }
  });
});
```

- [ ] **Step 7: Run test, verify failure**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/features.test.ts
```
Expected: FAIL.

- [ ] **Step 8: Create `content/features.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/features.ts`
```typescript
import type { LucideIcon } from "lucide-react";
import { MapPinned, ShoppingBag, Sparkles, CloudSun } from "lucide-react";

export type Feature = {
  id: "fields" | "shop" | "ai" | "weather";
  title: string;
  description: string;
  icon: LucideIcon;
  screenSrc: string;
  comingSoon?: boolean;
};

export const features: Feature[] = [
  {
    id: "fields",
    title: "Поля",
    description:
      "Ведіть облік всіх своїх полів з культурами, сезонами та аналітикою врожайності.",
    icon: MapPinned,
    screenSrc: "/screens/fields-list.png",
  },
  {
    id: "shop",
    title: "Магазин",
    description:
      "Замовляйте насіння, добрива та засоби захисту напряму в додатку. Доставка Новою поштою або кур'єром.",
    icon: ShoppingBag,
    screenSrc: "/screens/shop-catalog.png",
  },
  {
    id: "ai",
    title: "AI-діагностика",
    description:
      "Сфотографуйте листок — отримайте діагноз проблеми рослини і рекомендації.",
    icon: Sparkles,
    screenSrc: "/screens/ai-result.png",
    comingSoon: true,
  },
  {
    id: "weather",
    title: "Погода",
    description:
      "Точний прогноз по вашій області на 7 днів — плануйте польові роботи.",
    icon: CloudSun,
    screenSrc: "/screens/home.png",
  },
];
```

- [ ] **Step 9: Run test, verify pass**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/features.test.ts
```
Expected: PASS.

- [ ] **Step 10: Write failing test for testimonials**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/content/testimonials.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import { testimonials } from "@/content/testimonials";

describe("testimonials", () => {
  it("has exactly 3 items per spec §8.6", () => {
    expect(testimonials).toHaveLength(3);
  });

  it("each item has name, role, region, quote, initial", () => {
    for (const t of testimonials) {
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.role.length).toBeGreaterThan(0);
      expect(t.region.length).toBeGreaterThan(0);
      expect(t.quote.length).toBeGreaterThan(20);
      expect(t.initial).toMatch(/^[А-ЯЇІЄҐ]$/u);
    }
  });
});
```

- [ ] **Step 11: Run test, verify failure**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/testimonials.test.ts
```
Expected: FAIL.

- [ ] **Step 12: Create `content/testimonials.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/testimonials.ts`
```typescript
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  region: string;
  crop: string;
  initial: string;
  quote: string;
  accent: "green" | "navy" | "warning";
};

export const testimonials: Testimonial[] = [
  {
    id: "kovalchuk",
    name: "Олексій Ковальчук",
    role: "Фермер",
    region: "Полтавщина",
    crop: "Пшениця, 120 га",
    initial: "О",
    quote:
      "Нарешті один додаток замість трьох. Всі поля, операції, сезон — в телефоні, завжди під рукою.",
    accent: "green",
  },
  {
    id: "levchenko",
    name: "Марія Левченко",
    role: "Агроном",
    region: "Вінниччина",
    crop: "Кукурудза, соняшник, 250 га",
    initial: "М",
    quote:
      "AI-діагностика допомагає швидко зрозуміти проблему в полі — без пошуку довідників. Для нашої команди це плюс.",
    accent: "navy",
  },
  {
    id: "shevchenko",
    name: "Василь Шевченко",
    role: "Керівник господарства",
    region: "Черкащина",
    crop: "Ріпак, пшениця, 450 га",
    initial: "В",
    quote:
      "Магазин в додатку економить купу часу — замовляєш насіння прямо з поля, без дзвінків менеджеру.",
    accent: "warning",
  },
];
```

- [ ] **Step 13: Run test, verify pass**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/content/testimonials.test.ts
```
Expected: PASS.

- [ ] **Step 14: Create remaining content modules (no tests needed, pure data)**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/site.ts`
```typescript
export const site = {
  name: "Grano",
  tagline: "Твій цифровий агроном",
  url: "https://grano-app.com",
  email: "support@grano-app.com",
  phone: "+380 44 123 45 67",
  phoneHref: "tel:+380441234567",
  supportHours: "Пн–Пт 9:00–18:00",
  appStoreUrl: "https://apps.apple.com/ua/app/grano/idTBD",
  playStoreUrl: "https://play.google.com/store/apps/details?id=ua.grano.app",
  company: "ТОВ Грано",
  developer: "Faynosoft",
  mainSite: "https://grano.in.ua",
} as const;
```

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/nav.ts`
```typescript
export const headerNav = [
  { label: "Можливості", href: "#features" },
  { label: "Як працює", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Підтримка", href: "/support" },
] as const;
```

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/deep-dives.ts`
```typescript
export type DeepDive = {
  id: "fields" | "shop" | "ai" | "weather";
  title: string;
  pill?: string;
  lede: string;
  bullets: [string, string, string];
  screenSrc: string;
  alt: string;
  disclaimer?: string;
  mockupSide: "left" | "right";
  bg: "cream" | "white";
};

export const deepDives: DeepDive[] = [
  {
    id: "fields",
    title: "Всі поля — на одній карті",
    lede:
      "Додавайте поля з точними межами, фіксуйте операції, відстежуйте культуру і сезон. Grano веде історію за вас.",
    bullets: [
      "Додавайте поля вручну або через Google Maps",
      "Історія культур, сівозміна, врожайність по роках",
      "Сповіщення про ключові агрооперації в потрібний час",
    ],
    screenSrc: "/screens/field-detail.png",
    alt: "Екран деталей поля з культурою та операціями",
    mockupSide: "left",
    bg: "cream",
  },
  {
    id: "shop",
    title: "Магазин агрохімії — в твоїй кишені",
    lede:
      "Купуйте насіння, добрива і ЗЗР напряму. Каталог, кошик, онлайн-оплата, доставка Новою поштою — без дзвінків і переговорів.",
    bullets: [
      "Великий каталог: насіння, добрива, засоби захисту",
      "Доставка Новою поштою або кур'єром",
      "Онлайн-оплата: Visa, Mastercard, Google Pay, Apple Pay",
    ],
    screenSrc: "/screens/shop-catalog.png",
    alt: "Каталог магазину з насінням і добривами",
    mockupSide: "right",
    bg: "white",
  },
  {
    id: "ai",
    title: "Хвороби рослин — по одному фото",
    pill: "Скоро",
    lede:
      "Сфотографуйте уражений листок — AI визначить проблему і запропонує план обробки. Без довідників, без здогадок.",
    bullets: [
      "Розпізнавання основних хвороб і дефіцитів",
      "Рівень ризику і рекомендовані заходи",
      "Історія всіх діагностик за полем",
    ],
    screenSrc: "/screens/ai-result.png",
    alt: "Екран результату AI-діагностики з діагнозом «Борошниста роса»",
    disclaimer: "AI-діагностика запрацює в повному обсязі в 2026 році.",
    mockupSide: "left",
    bg: "cream",
  },
  {
    id: "weather",
    title: "Прогноз по твоїй області",
    lede:
      "Актуальна погода і прогноз на 7 днів — вмонтовані на головному екрані. Плануйте обробку без зайвих додатків.",
    bullets: [
      "Точний прогноз через Open-Meteo API",
      "Сповіщення про ризики (заморозки, зливи)",
      "Інтеграція з завданнями — плануй по погоді",
    ],
    screenSrc: "/screens/weather-card.png",
    alt: "Картка погоди на головному екрані",
    mockupSide: "right",
    bg: "white",
  },
];
```

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/how-it-works.ts`
```typescript
import type { LucideIcon } from "lucide-react";
import { Download, UserPlus, Leaf } from "lucide-react";

export type Step = {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const steps: Step[] = [
  {
    index: 1,
    title: "Завантажте Grano",
    description: "Безкоштовно в App Store або Google Play.",
    icon: Download,
  },
  {
    index: 2,
    title: "Створіть аккаунт",
    description: "Ім'я, телефон, email — і ви готові.",
    icon: UserPlus,
  },
  {
    index: 3,
    title: "Додайте поля і починайте",
    description: "Grano візьме на себе облік, нагадування і аналітику.",
    icon: Leaf,
  },
];
```

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/stats.ts`
```typescript
export type Stat = {
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { value: "4 модулі", label: "ключових можливостей" },
  { value: "1 000+ га", label: "під обліком в системі" },
  { value: "7 днів", label: "прогноз погоди" },
  { value: "UA", label: "тільки українська" },
];

export const statsDisclaimer = "Дані станом на запуск платформи, 2026 рік.";
```

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/content/footer.ts`
```typescript
export const footerColumns = [
  {
    title: "Продукт",
    links: [
      { label: "Можливості", href: "#features" },
      { label: "Як працює", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Підтримка",
    links: [
      { label: "Центр підтримки", href: "/support" },
      { label: "support@grano-app.com", href: "mailto:support@grano-app.com" },
    ],
  },
  {
    title: "Компанія",
    links: [
      { label: "Про Grano", href: "/support#about" },
      { label: "grano.in.ua", href: "https://grano.in.ua", external: true },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;
```

- [ ] **Step 15: Run full content test suite, verify all pass**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test
```
Expected: all 3 test files pass.

- [ ] **Step 16: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(content): add typed content modules with completeness tests"
```

---

## Task 6: UI Primitives

**Files:**
- Create: `lib/cn.ts`, `components/ui/container.tsx`, `components/ui/section.tsx`, `components/ui/button.tsx`, `components/ui/pill.tsx`, `components/ui/orn-divider.tsx`, `components/ui/store-badges.tsx`, `components/ui/iphone-mockup.tsx`, `components/ui/accordion-item.tsx`
- Create: `tests/components/accordion-item.test.tsx`
- Add placeholder SVGs: `public/store-badges/app-store.svg`, `public/store-badges/google-play.svg`

- [ ] **Step 1: Create `lib/cn.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/lib/cn.ts`
```typescript
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
```

- [ ] **Step 2: Create `components/ui/container.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/container.tsx`
```typescript
import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-20", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/ui/section.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/section.tsx`
```typescript
import { cn } from "@/lib/cn";

type Bg = "white" | "cream" | "navy";

const bgMap: Record<Bg, string> = {
  white: "bg-white text-navy-900",
  cream: "bg-cream-50 text-navy-900",
  navy: "bg-navy-900 text-white",
};

export function Section({
  id,
  bg = "white",
  className,
  children,
}: {
  id?: string;
  bg?: Bg;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-30", bgMap[bg], className)}
    >
      {children}
    </section>
  );
}
```

(Note: Tailwind's default `py-30` isn't standard; if v4 utilities don't produce it, the engineer should use `py-[120px]` instead. Same for consistent vertical padding: mobile `80px` = `py-20`, desktop `120px` = `py-[120px] md:py-[120px]`. Adjust the above to `className={cn("py-20 md:py-[120px]", bgMap[bg], className)}` if `md:py-30` doesn't compile.)

- [ ] **Step 4: Create `components/ui/button.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/button.tsx`
```typescript
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "ghost" | "ghost-light";
  size?: "md" | "lg";
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-green-500 text-white shadow-cta hover:bg-green-600 active:bg-green-700",
  ghost:
    "text-navy-900 hover:bg-gray-100",
  "ghost-light":
    "text-white hover:bg-white/10",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-pill font-bold transition-colors transition-transform duration-200 hover:scale-[1.02]",
    variants[variant],
    sizes[size],
    className
  );
  if (href) {
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Create `components/ui/pill.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/pill.tsx`
```typescript
import { cn } from "@/lib/cn";

type Tone = "green" | "warning" | "navy";

const tones: Record<Tone, string> = {
  green: "bg-green-50 text-green-700",
  warning: "bg-warning-bg text-warning",
  navy: "bg-navy-900/10 text-navy-900",
};

export function Pill({
  tone = "green",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 6: Create `components/ui/orn-divider.tsx` with inline repeating embroidery SVG**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/orn-divider.tsx`
```typescript
import { cn } from "@/lib/cn";

type Props = {
  tone?: "navy" | "white";
  className?: string;
};

export function OrnDivider({ tone = "navy", className }: Props) {
  const color = tone === "navy" ? "#1E2E3E" : "#FFFFFF";
  const opacity = tone === "navy" ? 0.2 : 0.3;
  const fill = encodeURIComponent(color);
  return (
    <div
      aria-hidden="true"
      className={cn("h-3 w-full", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12'%3E%3Cg fill='${fill}' fill-opacity='${opacity}'%3E%3Cpath d='M6 0L12 6L6 12L0 6Z'/%3E%3Cpath d='M18 0L24 6L18 12L12 6Z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "24px 12px",
        backgroundPosition: "center",
      }}
    />
  );
}
```

- [ ] **Step 7: Create `components/ui/store-badges.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/store-badges.tsx`
```typescript
import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a href={site.appStoreUrl} target="_blank" rel="noreferrer" aria-label="Скачати в App Store">
        <Image
          src="/store-badges/app-store.svg"
          alt="App Store"
          width={160}
          height={52}
          className="h-12 w-auto"
        />
      </a>
      <a href={site.playStoreUrl} target="_blank" rel="noreferrer" aria-label="Скачати в Google Play">
        <Image
          src="/store-badges/google-play.svg"
          alt="Google Play"
          width={180}
          height={52}
          className="h-12 w-auto"
        />
      </a>
    </div>
  );
}
```

- [ ] **Step 8: Place official store badge SVGs**

Download the Ukrainian-localized badges:
- App Store: https://developer.apple.com/app-store/marketing/guidelines/ → "Скачайте в App Store" UA badge
- Google Play: https://play.google.com/intl/en_us/badges/ → Ukrainian badge

Save as `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/public/store-badges/app-store.svg` and `.../google-play.svg`.

If the official Ukrainian localization is unavailable, fall back to the English badge. This is a human step.

- [ ] **Step 9: Create `components/ui/iphone-mockup.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/iphone-mockup.tsx`
```typescript
import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function IPhoneMockup({ src, alt, priority, className }: Props) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[320px] rounded-[44px] border-8 border-navy-900 bg-navy-900 shadow-mockup",
        className
      )}
    >
      <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-navy-900" />
      <div className="overflow-hidden rounded-[36px] bg-white">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={1386}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
```

(Rationale: CSS-built iPhone frame — no external library. Simple, adequate for MVP.)

- [ ] **Step 10: Write failing test for AccordionItem**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/components/accordion-item.test.tsx`
```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccordionItem } from "@/components/ui/accordion-item";

describe("AccordionItem", () => {
  it("is collapsed by default", () => {
    render(
      <AccordionItem id="q1" question="Питання?" answer="Відповідь." />
    );
    const btn = screen.getByRole("button", { name: /Питання/ });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("region", { hidden: true })).toHaveAttribute("hidden");
  });

  it("expands on click", async () => {
    const user = userEvent.setup();
    render(
      <AccordionItem id="q1" question="Питання?" answer="Відповідь." />
    );
    const btn = screen.getByRole("button", { name: /Питання/ });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Відповідь.")).toBeVisible();
  });

  it("toggles on Enter key", async () => {
    const user = userEvent.setup();
    render(
      <AccordionItem id="q1" question="Питання?" answer="Відповідь." />
    );
    const btn = screen.getByRole("button", { name: /Питання/ });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
```

Update `vitest.config.ts` to include jest-dom matchers:

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/setup.ts`
```typescript
import "@testing-library/jest-dom/vitest";
```

Then patch `vitest.config.ts` — add `setupFiles: ["./tests/setup.ts"]` inside `test:`.

- [ ] **Step 11: Run test, verify failure**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/components/accordion-item.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/ui/accordion-item'`.

- [ ] **Step 12: Implement `components/ui/accordion-item.tsx`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/ui/accordion-item.tsx`
```typescript
"use client";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  question: string;
  answer: string;
};

export function AccordionItem({ id, question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-h4 font-bold text-navy-900"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        role="region"
        id={panelId}
        hidden={!open}
        className="pb-5 pr-8 text-base text-navy-700"
      >
        {answer}
      </div>
    </div>
  );
}
```

- [ ] **Step 13: Run test, verify pass**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test -- tests/components/accordion-item.test.tsx
```
Expected: PASS, 3/3.

- [ ] **Step 14: Run full test suite**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm test
```
Expected: all tests pass.

- [ ] **Step 15: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(ui): add primitives (container, section, button, pill, orn-divider, store-badges, iphone-mockup, accordion-item)"
```

---

## Task 7: Prepare Screen Assets from Дизайн/

**Files:**
- Create: `public/screens/home.png`, `fields-list.png`, `field-detail.png`, `shop-catalog.png`, `cart.png`, `ai-result.png`, `weather-card.png`
- Create: `public/photos/hero-wheat-field.jpg`

- [ ] **Step 1: Identify source screenshots in `landing/Дизайн/`**

Source files are timestamped. Map by visual content:
- Home screen (with weather card) → largest "screenshot of main screen" export
- Fields list → screen showing map + list of fields
- Field detail → screen showing one field's operations
- Shop catalog → screen with product grid
- Cart → screen with cart items
- AI result → screen showing diagnosis result
- Weather card → same as home, or cropped

The engineer should open `landing/Дизайн/` in Finder/Preview, visually identify each needed screen, and note the filename.

- [ ] **Step 2: Crop & optimize each screenshot**

For each selected source file, use ImageMagick or similar to:
1. Crop to exact app bounds (remove device chrome if present)
2. Resize to max 1280px width (for 2× retina on ~640px display)
3. Strip metadata
4. Output to `landing/public/screens/<name>.png`

Example for one file (replace `<source>` with actual filename):
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing
mkdir -p public/screens
magick "Дизайн/<source>.png" -resize 1280x -strip public/screens/home.png
```

If ImageMagick isn't installed, install via `brew install imagemagick`.

Required output files:
- `public/screens/home.png`
- `public/screens/fields-list.png`
- `public/screens/field-detail.png`
- `public/screens/shop-catalog.png`
- `public/screens/cart.png`
- `public/screens/ai-result.png`
- `public/screens/weather-card.png`

If any screen isn't available in `Дизайн/`, stop and ask the user to export it. Do NOT proceed with a placeholder — the deep-dive sections depend on having the right screens.

- [ ] **Step 3: Download hero wheat-field photo**

Search https://unsplash.com for `Ukrainian wheat field sunset`. Pick a horizontal, golden-hour, high-resolution photo (at least 2000px wide). Download, note the photographer credit (for footer attribution if required by license), and save as:

`/Users/oleksiimotornyi/Documents/Projects/Grano/landing/public/photos/hero-wheat-field.jpg`

Optimize: compress via `tinypng.com` or `sharp-cli` to ~300KB max.

- [ ] **Step 4: Verify files exist and are reasonable size**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && ls -lh public/screens public/photos
```
Expected: each screen file 50–300KB, hero photo ≤500KB.

- [ ] **Step 5: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add public/ && git commit -m "feat(assets): add cropped app screens and hero wheat-field photo"
```

---

## Task 8: Header Section

**Files:**
- Create: `components/sections/header.tsx`

Spec ref: §8.1.

- [ ] **Step 1: Implement header with scroll-triggered bg**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/header.tsx`
```typescript
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { headerNav } from "@/content/nav";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled ? "bg-white/95 shadow-card backdrop-blur" : "bg-transparent"
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-4 py-4">
        <Link href="/" aria-label="Grano — головна">
          <Logo priority />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {headerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-navy-700 hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href="#download" size="md">Скачати</Button>
        </div>
        <button
          type="button"
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {headerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-navy-900"
              >
                {item.label}
              </Link>
            ))}
            <Button href="#download" size="md" className="self-start">Скачати</Button>
          </Container>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Wire Header into homepage for preview**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
import { Header } from "@/components/sections/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="h-screen bg-cream-50" />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check in browser**

Run `npm run dev`. Scroll the page. Verify:
- Header is transparent over cream bg at top.
- Header gets white bg + shadow after scrolling 80px.
- Mobile (resize browser <768px): shows hamburger; clicking opens/closes; nav links visible.

- [ ] **Step 4: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add sticky header with scroll-triggered bg and mobile menu"
```

---

## Task 9: Hero Section

**Files:**
- Create: `components/sections/hero.tsx`

Spec ref: §8.2.

- [ ] **Step 1: Implement hero**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/hero.tsx`
```typescript
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Pill } from "@/components/ui/pill";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { StoreBadges } from "@/components/ui/store-badges";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section id="download" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/photos/hero-wheat-field.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-[40px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white" />
      </div>
      <Container className="grid min-h-[80vh] grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:py-[120px]">
        <div className="flex flex-col gap-6">
          <Pill tone="green">Для українських фермерів</Pill>
          <h1 className="font-display text-h1 font-bold tracking-tight text-navy-900">
            {site.tagline}
          </h1>
          <p className="max-w-xl text-lede text-navy-500">
            Управляйте полями, діагностуйте хвороби рослин і замовляйте насіння —
            все в одному застосунку.
          </p>
          <StoreBadges className="mt-2" />
        </div>
        <div className="flex justify-center md:justify-end">
          <IPhoneMockup
            src="/screens/home.png"
            alt="Головний екран додатку Grano"
            priority
          />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Verify: blurred wheat-field background, legible H1 in e-Ukraine Head, green pill above, store badges below, iPhone mockup with home screen on right (desktop), stacked on mobile.

- [ ] **Step 4: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add hero with blurred wheat-field bg and iPhone mockup"
```

---

## Task 10: Feature Cards Section

**Files:**
- Create: `components/sections/feature-cards.tsx`

Spec ref: §8.3.

- [ ] **Step 1: Implement feature cards**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/feature-cards.tsx`
```typescript
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { features } from "@/content/features";

export function FeatureCards() {
  return (
    <Section id="features" bg="white">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-h2 font-bold text-navy-900">
            Все, що потрібно агроному в одному додатку
          </h2>
          <p className="mt-4 text-lede text-navy-500">
            Чотири ключові можливості Grano — в інтерфейсі, який зрозуміє будь-який фермер.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.id}
                className="group flex flex-col gap-4 rounded-card bg-white p-6 shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-mockup"
              >
                <Icon className="h-12 w-12 text-green-700" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <h3 className="text-h4 font-bold text-navy-900">{f.title}</h3>
                  {f.comingSoon && <Pill tone="warning">Скоро</Pill>}
                </div>
                <p className="text-sm text-navy-500">{f.description}</p>
                <div className="relative mt-auto aspect-[10/16] overflow-hidden rounded-[12px] bg-cream-50">
                  <Image
                    src={f.screenSrc}
                    alt={`Скріншот розділу «${f.title}»`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 90vw"
                    className="object-cover object-top"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Wire into page**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
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
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Verify: 4 cards in a row on desktop, 2×2 on tablet, 1 col on mobile. AI card has "Скоро" pill. Cards lift on hover. Orn divider appears below — repeating navy diamonds at 20% opacity.

- [ ] **Step 4: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add 4-card features grid"
```

---

## Task 11: Deep-Dive Section (reusable) + 4 instances

**Files:**
- Create: `components/sections/deep-dive.tsx`

Spec ref: §8.4.

- [ ] **Step 1: Implement reusable DeepDive component**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/deep-dive.tsx`
```typescript
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { IPhoneMockup } from "@/components/ui/iphone-mockup";
import { cn } from "@/lib/cn";
import type { DeepDive as DeepDiveData } from "@/content/deep-dives";

export function DeepDive({ data }: { data: DeepDiveData }) {
  const { mockupSide, bg, title, pill, lede, bullets, screenSrc, alt, disclaimer } = data;
  const mockupFirst = mockupSide === "left";
  return (
    <Section id={data.id} bg={bg}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className={cn("flex justify-center", mockupFirst ? "md:order-1" : "md:order-2")}>
            <IPhoneMockup src={screenSrc} alt={alt} />
          </div>
          <div className={cn("flex flex-col gap-6", mockupFirst ? "md:order-2" : "md:order-1")}>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-h3 font-bold text-navy-900">{title}</h3>
              {pill && <Pill tone="warning">{pill}</Pill>}
            </div>
            <p className="text-lede text-navy-700">{lede}</p>
            <ul className="flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-base text-navy-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {disclaimer && (
              <p className="text-xs text-navy-500">{disclaimer}</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Wire all 4 deep-dives into page**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeatureCards } from "@/components/sections/feature-cards";
import { DeepDive } from "@/components/sections/deep-dive";
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
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Verify:
- 4 deep-dives stacked vertically.
- Alternating mockup positions (left, right, left, right).
- Alternating backgrounds (cream, white, cream, white).
- AI section shows "Скоро" pill + small disclaimer below bullets.
- On mobile: mockup always on top, text below.

- [ ] **Step 4: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add reusable deep-dive component with 4 content instances"
```

---

## Task 12: How It Works Section

**Files:**
- Create: `components/sections/how-it-works.tsx`

Spec ref: §8.5.

- [ ] **Step 1: Implement**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/how-it-works.tsx`
```typescript
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
```

- [ ] **Step 2: Wire in and visual check**

Add `<HowItWorks />` after the deep-dives in `app/page.tsx` (before the second `<OrnDivider />`). Run `npm run dev`. Verify: 3-step horizontal timeline on desktop, vertical stack on mobile, dashed line connecting steps on desktop.

- [ ] **Step 3: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add how-it-works 3-step timeline"
```

---

## Task 13: Social Proof Section

**Files:**
- Create: `components/sections/social-proof.tsx`

Spec ref: §8.6.

- [ ] **Step 1: Implement**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/social-proof.tsx`
```typescript
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { stats, statsDisclaimer } from "@/content/stats";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/cn";

const accentBg: Record<string, string> = {
  green: "bg-green-500 text-white",
  navy: "bg-navy-700 text-white",
  warning: "bg-warning text-white",
};

export function SocialProof() {
  return (
    <Section bg="cream">
      <Container>
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="font-display text-h2 font-bold text-navy-900">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-navy-500">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mb-16 text-center text-xs text-navy-500">{statsDisclaimer}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex flex-col gap-6 rounded-card bg-white p-6 shadow-card"
            >
              <blockquote className="text-base italic text-navy-900">
                “{t.quote}”
              </blockquote>
              <hr className="border-gray-200" />
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold",
                    accentBg[t.accent]
                  )}
                  aria-hidden="true"
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-900">{t.name}</div>
                  <div className="text-xs text-navy-500">
                    {t.role}, {t.region}
                  </div>
                  <div className="text-xs text-navy-500">{t.crop}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Wire in + visual check**

Add `<SocialProof />` after `<HowItWorks />` in `app/page.tsx`. Run `npm run dev`. Verify stats row + 3 cream-bg testimonials with initial-circle avatars.

- [ ] **Step 3: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add social-proof stats + testimonials"
```

---

## Task 14: Final CTA + FAQ + Footer

**Files:**
- Create: `components/sections/final-cta.tsx`, `components/sections/faq.tsx`, `components/sections/footer.tsx`

- [ ] **Step 1: Implement Final CTA**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/final-cta.tsx`
```typescript
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Logo } from "@/components/brand/logo";
import { StoreBadges } from "@/components/ui/store-badges";

export function FinalCta() {
  return (
    <Section bg="navy" className="relative">
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-green-500/20"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-green-500/20"
      />
      <Container className="flex flex-col items-center gap-8 text-center">
        <Logo variant="dark" />
        <h2 className="font-display text-h2 font-bold text-white">
          Grano — в твоєму телефоні
        </h2>
        <p className="text-lede text-white/70">
          Усі модулі безкоштовні. Без реклами.
        </p>
        <StoreBadges />
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Implement FAQ**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/faq.tsx`
```typescript
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AccordionItem } from "@/components/ui/accordion-item";
import { faqItems } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq" bg="white">
      <Container className="max-w-3xl">
        <h2 className="mb-10 text-center font-display text-h2 font-bold text-navy-900">
          Часті запитання
        </h2>
        <div>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: Implement Footer**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/sections/footer.tsx`
```typescript
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { StoreBadges } from "@/components/ui/store-badges";
import { OrnDivider } from "@/components/ui/orn-divider";
import { footerColumns } from "@/content/footer";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-navy-900 pt-20 pb-10 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo variant="dark" />
            <p className="text-sm text-white/60">{site.tagline}</p>
            <StoreBadges />
          </div>
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <OrnDivider tone="white" className="my-10" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
          <div>© 2026 {site.company}. Всі права захищені.</div>
          <div>Зроблено {site.developer}</div>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 4: Assemble full homepage**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/page.tsx`
```typescript
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
```

- [ ] **Step 5: Visual check — full homepage**

Run `npm run dev`. Scroll through the full homepage. Verify all 15 sections appear in order (per spec §7). Open FAQ items — they expand/collapse smoothly. Test at desktop, tablet (768px), mobile (375px) widths.

- [ ] **Step 6: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(sections): add final-cta, faq, footer; assemble homepage"
```

---

## Task 15: Sub-pages (/privacy, /terms, /support)

**Files:**
- Create: `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/support/page.tsx`

Spec ref: §9.

- [ ] **Step 1: Create shared layout by reusing Header/Footer**

Each sub-page is wrapped in the same Header/Footer as the homepage. Since Next.js App Router supports nested layouts, we add a single `components/layouts/page-shell.tsx`:

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/components/layouts/page-shell.tsx`
```typescript
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[720px] px-6 py-20 md:py-[120px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create `/privacy` with placeholder text**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/privacy/page.tsx`
```typescript
import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";

export const metadata: Metadata = {
  title: "Політика конфіденційності — Grano",
  description:
    "Політика конфіденційності застосунку Grano. Які дані збираються, як використовуються, як можна запитати видалення.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="flex flex-col gap-6">
        <h1 className="font-display text-h2 font-bold text-navy-900">
          Політика конфіденційності
        </h1>
        <p className="text-sm text-navy-500">Остання редакція: 2026-04-22</p>

        <p className="rounded-card border border-warning-bg bg-warning-bg/50 p-4 text-sm text-navy-900">
          Це placeholder-версія документа. Остаточну редакцію підготує юридична
          команда ТОВ Грано; до заміни на повний текст використовуйте лише для
          перевірки структури.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">1. Які дані ми збираємо</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Grano збирає: (а) контактні дані, які ви надаєте при реєстрації (ім'я,
          телефон, email); (б) дані про поля та операції, які ви самостійно
          вводите в додаток; (в) технічні логи для забезпечення стабільної роботи.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">2. Як ми використовуємо дані</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Персональні дані використовуються виключно для надання функцій додатку:
          облік полів, замовлення в магазині, сповіщення про операції. Ми не
          продаємо дані третім сторонам.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">3. Зберігання та безпека</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Дані зберігаються на серверах у Європейському Союзі з шифруванням
          TLS 1.3 при передачі та AES-256 при зберіганні.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">4. Ваші права</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Ви маєте право запитати доступ до своїх даних, виправлення чи повне
          видалення. Напишіть на support@grano-app.com з темою «Доступ до даних»
          або «Видалення акаунту» — відповімо протягом 30 днів.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">5. Контакти</h2>
        <p className="text-base leading-relaxed text-navy-700">
          З питаннями щодо обробки персональних даних пишіть на
          support@grano-app.com.
        </p>
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 3: Create `/terms` with placeholder text**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/terms/page.tsx`
```typescript
import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";

export const metadata: Metadata = {
  title: "Умови використання — Grano",
  description:
    "Умови використання застосунку Grano та послуг магазину агрохімії.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="flex flex-col gap-6">
        <h1 className="font-display text-h2 font-bold text-navy-900">
          Умови використання
        </h1>
        <p className="text-sm text-navy-500">Остання редакція: 2026-04-22</p>

        <p className="rounded-card border border-warning-bg bg-warning-bg/50 p-4 text-sm text-navy-900">
          Це placeholder-версія документа. Остаточну редакцію підготує юридична
          команда ТОВ Грано.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">1. Загальні положення</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Використовуючи додаток Grano, ви погоджуєтесь з цими умовами. Якщо ви
          не згодні з будь-яким пунктом — не використовуйте додаток.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">2. Реєстрація</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Для використання додатку потрібна реєстрація з вказанням дійсних
          контактних даних. Відповідальність за достовірність даних несе
          користувач.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">3. Замовлення в магазині</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Оформлене замовлення є офертою. Підтвердження від Grano — акцептом.
          Доставка та оплата здійснюються згідно з обраним способом.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">4. Відповідальність</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Grano надається «як є». Ми не несемо відповідальності за рішення,
          прийняті на основі рекомендацій AI-діагностики — остаточне рішення
          приймає агроном.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">5. Зміни умов</h2>
        <p className="text-base leading-relaxed text-navy-700">
          ТОВ Грано має право оновлювати ці умови. Про суттєві зміни
          повідомляємо email-розсилкою та нотифікацією в додатку.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">6. Контакти</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Питання щодо умов — на support@grano-app.com.
        </p>
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 4: Create `/support`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/support/page.tsx`
```typescript
import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";
import { AccordionItem } from "@/components/ui/accordion-item";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/content/faq";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Підтримка — Grano",
  description:
    "Центр підтримки Grano. Відповіді на часті запитання та способи зв'язку з командою.",
};

export default function SupportPage() {
  return (
    <PageShell>
      <h1 className="font-display text-h2 font-bold text-navy-900">
        Центр підтримки
      </h1>
      <p className="mt-4 text-lede text-navy-500">
        Відповімо на ваші питання про Grano. Якщо не знайшли відповіді нижче —
        напишіть нам.
      </p>

      <section id="contact" className="mt-10 rounded-card bg-cream-50 p-6">
        <h2 className="text-h4 font-bold text-navy-900">Як зв'язатись</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-navy-500">Email</dt>
            <dd>
              <a className="text-navy-900 underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-navy-500">Телефон</dt>
            <dd>
              <a className="text-navy-900 underline" href={site.phoneHref}>
                {site.phone}
              </a>
              <span className="ml-2 text-xs text-navy-500">({site.supportHours})</span>
            </dd>
          </div>
        </dl>
        <Button href={`mailto:${site.email}`} className="mt-6">Написати нам</Button>
      </section>

      <section className="mt-12">
        <h2 className="text-h3 font-bold text-navy-900">Часті запитання</h2>
        <div className="mt-6">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 5: Visual check each sub-page**

Run `npm run dev`. Visit:
- `http://localhost:3000/privacy` — renders privacy text with warning banner.
- `http://localhost:3000/terms` — renders terms text.
- `http://localhost:3000/support` — renders contact card + FAQ accordion.

All three should have the Header and Footer.

- [ ] **Step 6: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(pages): add /privacy, /terms, /support with page-shell layout"
```

---

## Task 16: SEO — metadata, sitemap, robots

**Files:**
- Create: `lib/metadata.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `lib/metadata.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/lib/metadata.ts`
```typescript
import type { Metadata } from "next";
import { site } from "@/content/site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння. Безкоштовно.",
  keywords: [
    "додаток для фермерів",
    "цифровий агроном",
    "управління полями",
    "AI-діагностика рослин",
    "магазин агрохімії",
    "Grano",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Мобільний додаток для українських фермерів. Безкоштовно.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [ ] **Step 2: Apply in root layout**

Modify `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { comfortaa, eUkraineHead } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${comfortaa.variable} ${eUkraineHead.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create `app/sitemap.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/sitemap.ts`
```typescript
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/support`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
```

- [ ] **Step 4: Create `app/robots.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/app/robots.ts`
```typescript
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Add JSON-LD MobileApplication schema to homepage**

Modify `app/page.tsx` — at the top of the returned JSX add:
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "Grano",
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      description:
        "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "UAH",
      },
    }),
  }}
/>
```

- [ ] **Step 6: Verify SEO outputs**

Run `npm run build && npm start`. Visit:
- `http://localhost:3000/sitemap.xml` — valid XML with 4 URLs.
- `http://localhost:3000/robots.txt` — contains sitemap URL.
- View source of `/` — `<meta name="description">`, `<meta property="og:*">`, and JSON-LD block present.

Kill server.

- [ ] **Step 7: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "feat(seo): add metadata defaults, sitemap, robots, JSON-LD MobileApplication schema"
```

---

## Task 17: E2E Smoke Test + Accessibility

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/landing.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npx playwright install chromium
```
Expected: chromium downloaded.

- [ ] **Step 2: Create `playwright.config.ts`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/playwright.config.ts`
```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write E2E smoke test**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/tests/e2e/landing.spec.ts`
```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Grano landing", () => {
  test("homepage renders with key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /Твій цифровий агроном/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Все, що потрібно агроному/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Як почати/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Часті запитання/ })).toBeVisible();
  });

  test("FAQ accordion expands", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /Чи додаток безкоштовний/ });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/безкоштовний для всіх користувачів/)).toBeVisible();
  });

  test("sub-pages are reachable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /Політика конфіденційності/ })).toBeVisible();
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Умови використання/ })).toBeVisible();
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: /Центр підтримки/ })).toBeVisible();
  });

  test("store badges link to correct URLs", async ({ page }) => {
    await page.goto("/");
    const appStore = page.getByRole("link", { name: /App Store/i }).first();
    await expect(appStore).toHaveAttribute("href", /apps\.apple\.com/);
    const playStore = page.getByRole("link", { name: /Google Play/i }).first();
    await expect(playStore).toHaveAttribute("href", /play\.google\.com/);
  });

  test("homepage has no critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(critical).toEqual([]);
  });

  test("sitemap.xml returns 4 URLs", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBe(200);
    const body = await page.content();
    expect(body.match(/<url>/g)?.length).toBe(4);
  });
});
```

- [ ] **Step 4: Run E2E suite**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run test:e2e
```
Expected: all tests pass on both `chromium-desktop` and `mobile` projects. If axe flags real AA violations, fix them (typically: missing alt text, bad contrast, missing labels) before proceeding.

- [ ] **Step 5: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add -A && git commit -m "test(e2e): add Playwright smoke + axe accessibility checks"
```

---

## Task 18: Performance Verification (Lighthouse)

**Files:** (none — verification only)

- [ ] **Step 1: Production build**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run build
```
Expected: build completes, no errors. Check the output — note any warnings about unused deps or image optimization.

- [ ] **Step 2: Start prod server**

Run:
```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm start
```
Leave running in the background.

- [ ] **Step 3: Run Lighthouse against mobile emulation**

In a second terminal:
```bash
npx lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop.html \
  --chrome-flags="--headless"

npx lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile \
  --output=html \
  --output-path=./lighthouse-mobile.html \
  --chrome-flags="--headless"
```

- [ ] **Step 4: Verify scores against spec §12 targets**

Open `lighthouse-mobile.html` in a browser. Targets:
- **LCP:** < 2.0s (mobile 4G emulation) → spec §12
- **CLS:** < 0.1
- **TBT:** < 200ms
- **Performance score:** ≥ 90
- **Accessibility:** 100
- **SEO:** 100

If any target fails, diagnose:
- LCP high → check hero image is marked `priority` + correctly sized
- CLS high → missing width/height on images, or font-swap shift
- TBT high → unexpected JS; check bundle via `next build` output

Fix inline; don't proceed until scores pass.

- [ ] **Step 5: Kill prod server and clean up**

Terminate `npm start`. Add Lighthouse reports to `.gitignore`:
```gitignore
lighthouse-*.html
```

- [ ] **Step 6: Commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add .gitignore && git commit -m "chore: ignore lighthouse reports"
```

---

## Task 19: Final Checklist + README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Run full verification**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && npm run typecheck && npm run lint && npm test && npm run test:e2e && npm run build
```
Expected: all green.

- [ ] **Step 2: Create `README.md`**

File: `/Users/oleksiimotornyi/Documents/Projects/Grano/landing/README.md`
```markdown
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
```

- [ ] **Step 3: Final commit**

```bash
cd /Users/oleksiimotornyi/Documents/Projects/Grano/landing && git add README.md && git commit -m "docs: add README"
```

---

## Post-Implementation

When all tasks are complete:

1. The landing is buildable, tested, and Lighthouse-verified.
2. Privacy/Terms text is a placeholder — needs final text from Grano legal before public launch.
3. Deploy target (Vercel vs Netlify) is a deferred decision per spec §15 Q4.
4. Hero photo attribution (if required by Unsplash license) goes in Footer.
5. Analytics/cookie banner is deferred per spec §15 Q5–Q6.
