# Grano Landing — Design Specification

**Date:** 2026-04-21
**Product:** Grano — мобільний додаток для українських фермерів (Flutter/Dart)
**Deliverable:** Маркетинговий лендінг на домені `grano-app.com`
**Language:** Українська (uk_UA)

---

## 1. Goals & Audience

### Primary goals
1. **Конверсія:** український фермер бачить лендінг → скачує додаток в App Store / Google Play
2. **Compliance:** лендінг задовольняє вимоги Apple App Store / Google Play до developer website (описує продукт, має Privacy Policy, Terms of Service, Support contact)

### Primary audience
Українські фермери 30-60 років, малий/середній бізнес (господарства 10-500 га). Культури: пшениця, кукурудза, соняшник, ячмінь, ріпак. Рівень цифрової грамотності — базовий-середній. Комунікація — пряма, без англіцизмів, без складного жаргону.

### Secondary audience
- Apple/Google App Store review team (формальна перевірка вимог)
- Партнери/дистриб'ютори Grano, що можуть скидати лінк
- SEO органічний трафік ("додаток для фермерів", "цифровий агроном")

---

## 2. Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Components за замовчуванням)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (strict)
- **Fonts:** self-hosted via `next/font/local`
- **Images:** `next/image` з `object-fit` optimizations
- **Icons:** Lucide React (матчиться до стилю icon-set в додатку)
- **Animations:** CSS only для MVP; Framer Motion — якщо буде потрібна складна motion
- **Deploy target:** Vercel або Netlify (визначимо пізніше); host-agnostic setup
- **Domain:** `grano-app.com` (primary), www redirect

---

## 3. Aesthetic Direction

**Variant B** — залишаємось у рамках бренду додатку (білий + sage-green + navy, rounded soft UI), додаємо субтильний **український акцент** через:

1. **Display font** — Unbounded (трендовий український display, безкоштовний)
2. **1px orn divider pattern** — тонка українська вишивка (horizontal SVG pattern, `currentColor` з 30% opacity) між секціями
3. **Теплий off-white** `cream-50` (#FAF8F3) для чергування секцій — замість холодного сірого
4. **Чесність** — реальна копірайт-мова для фермера, без маркетинг-води

**Ключове правило:** лендінг має виглядати як прямий родич додатку. Фермер, який завантажив додаток, має одразу впізнати той самий візуальний світ.

---

## 4. Color System

### Brand tokens (з додатку Grano)

```css
--navy-900:     #1E2E3E;   /* основний текст, dark sections, splash-bg */
--navy-700:     #243447;   /* secondary text, borders */
--navy-500:     #3A4F63;   /* muted text */

--green-500:    #85C059;   /* primary CTA, accent */
--green-600:    #6FA847;   /* CTA hover */
--green-700:    #3A8E3E;   /* leaf deep accent, link hover */
--green-50:     #EEF6E4;   /* soft green backgrounds, pill-badges */
```

### Neutrals

```css
--white:        #FFFFFF;
--cream-50:     #FAF8F3;   /* теплий off-white, чергування секцій */
--gray-100:     #F3F4F6;
--gray-200:     #E5E7EB;
--gray-400:     #9CA3AF;
--gray-600:     #4B5563;
```

### Semantic (consistent with app)

```css
--danger:       #D44040;
--danger-bg:    #F7DEE0;
--warning:      #E7962C;
--warning-bg:   #FCE7CE;
--success:      #85C059;   /* = green-500 */
```

### Dark (single use — final CTA banner + footer)

```css
--dark-bg:      #1E2E3E;   /* = navy-900 */
--dark-text:    #FFFFFF;
--dark-muted:   #9CA8B4;   /* subtle text on dark */
```

### Usage rules
- CTA-кнопки тільки `--green-500` → hover `--green-600`
- Основний текст завжди `--navy-900` на світлому фоні, `#FFFFFF` на dark
- Soft shadows: `0 8px 24px rgba(30, 46, 62, 0.08)` для cards і mockups
- Orn divider використовує `--navy-900` з 20% opacity

---

## 5. Typography

### Fonts

**Display** — **Unbounded** (автор Олександр Шиманов, безкоштовний, Google Fonts)
- H1, H2, великі numeric stats, CTA-headlines
- Weights: Medium (500), Bold (700)
- Source: Google Fonts → self-host через `next/font/google` (subsets: `cyrillic`, `latin`)
- Рішення прийнято 2026-04-22 замість e-Ukraine Head (сайт `e-ukraine.in.ua` недоступний).

**Body / UI** — **Comfortaa** (Google Fonts, підтверджено що використовується в додатку)
- H3, H4, підзаголовки, параграфи, кнопки, UI elements
- Weights: Regular (400), Medium (500), Bold (700)
- Source: Google Fonts → self-host через `next/font/google`

**Fallback stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Scale

| Role | Size desktop | Line-height | Weight | Font |
|------|--------------|-------------|--------|------|
| H1 (hero) | 64px (4rem) | 1.05 (67px) | 700 | Unbounded |
| H2 (section) | 48px (3rem) | 1.1 (53px) | 700 | Unbounded |
| H3 (feature / dive) | 32px (2rem) | 1.2 (38px) | 700 | Unbounded |
| H4 (card) | 22px (1.375rem) | 1.3 (28px) | 700 | Comfortaa |
| Lede (hero sub, section sub) | 20px | 1.5 (30px) | 400 | Comfortaa |
| Body | 16px | 1.5 (24px) | 400 | Comfortaa |
| Small | 14px | 1.4 (20px) | 400 | Comfortaa |
| Caption | 12px | 1.4 (17px) | 500 | Comfortaa |
| Button | 16px | 1.25 (20px) | 700 | Comfortaa |

**Mobile scale:** H1 → 40px, H2 → 32px, H3 → 24px. Body фіксований 16px.

**Тracking:** 0px скрізь (як в app — `letter-spacing: 0px`).

---

## 6. Layout System

### Container

- Max width: `1200px` (desktop)
- Horizontal padding: `24px` (mobile) / `48px` (tablet) / `80px` (desktop)
- Section vertical padding: `80px` (mobile) / `120px` (desktop)

### Grid
- CSS Grid / Flexbox; 12-col на desktop, single col на mobile
- Gap tokens: 8 / 16 / 24 / 32 / 48 / 64 / 80 px

### Radii
- Buttons: `999px` (pill, як в app)
- Cards: `20px`
- Input-like elements: `16px`

### Shadows
- `shadow-card`: `0 4px 16px rgba(30, 46, 62, 0.06)`
- `shadow-mockup`: `0 24px 64px -16px rgba(30, 46, 62, 0.2)`
- `shadow-cta`: `0 8px 20px rgba(133, 192, 89, 0.3)` (green glow під CTA)

### Ukrainian orn divider
- SVG 1px висотою з повторюваним мотивом (спрощений вишивковий ромб/хрестик)
- Ширина: 100% контейнера
- Колір: `--navy-900` на 20% opacity
- Використовується **тільки** між деякими секціями (не всіма) — між features→deep-dive, між deep-dive→how it works, між how it works→proof. Не використовуємо в hero, CTA, footer.

---

## 7. Page Structure

### Sections (in order)

1. **Header** (sticky, transparent→white on scroll)
2. **Hero**
3. **4 Feature Cards**
4. *orn divider*
5. **Deep-dive: Поля**
6. **Deep-dive: Магазин**
7. **Deep-dive: AI-діагностика** (з badge "Скоро" на потрібних елементах)
8. **Deep-dive: Погода**
9. *orn divider*
10. **How It Works** (3 steps)
11. *orn divider*
12. **Social Proof** (stats + 3 testimonials)
13. **Final CTA Banner** (dark)
14. **FAQ** (accordion, 6-8 items)
15. **Footer** (dark)

### Sub-pages
- `/privacy` — Політика конфіденційності
- `/terms` — Умови використання
- `/support` — Підтримка (FAQ розгорнуто + контакти)

---

## 8. Section Specs

### 8.1 Header
- Sticky, height 72px
- Зліва: лого Grano (wordmark SVG)
- По центру/справа: навігація `Можливості · Як працює · FAQ · Підтримка`
- Справа: primary CTA pill "Скачати" (скрол до final CTA) + language switcher *не потрібен* (лише UA)
- **Mobile:** hamburger menu, sheet-dropdown з повною навігацією

### 8.2 Hero (C+twik)

**Layout (desktop):**
```
Container (1200px)
┌─────────────────────┬────────────────────────┐
│ 50% text col        │ 50% visual col         │
│                     │                        │
│ [badge "Для фермерів"]  │  [Фон: фото поля    │
│                     │   пшениці, blur 40px,   │
│ H1 (Unbounded):│   opacity 40%]          │
│ Твій цифровий       │                        │
│ агроном             │   [iPhone mockup —      │
│                     │    Home screen додатку] │
│ Lede:               │   shadow-mockup         │
│ Управляйте полями,  │                        │
│ діагностуйте        │                        │
│ хвороби рослин      │                        │
│ і замовляйте насіння│                        │
│ — все в одному      │                        │
│ застосунку.         │                        │
│                     │                        │
│ [App Store badge]   │                        │
│ [Google Play badge] │                        │
│                     │                        │
└─────────────────────┴────────────────────────┘
```

**Mobile:** stacked, текст зверху, iPhone mockup знизу, фото-фон на весь hero.

**Copy:**
- Badge: `Для українських фермерів`
- H1: `Твій цифровий агроном`
- Lede: `Управляйте полями, діагностуйте хвороби рослин і замовляйте насіння — все в одному застосунку.`
- Store badges: офіційні з apple.com/app-store/marketing, play.google.com/intl/en_us/badges

### 8.3 Feature Cards (C)

**Layout:** 4 картки в ряд (desktop), 2×2 grid (tablet), 1 col (mobile).

**Картка:**
```
┌──────────────────┐
│ [Icon 48px — Lucide або copied from app] │
│                  │
│ H4: Поля         │
│                  │
│ Опис 1-2 рядки   │
│                  │
│ [Crop screenshot │
│  додатку — 16:10 │
│  аспект, borderless]│
│  shadow-card     │
└──────────────────┘
```

Card 4 ("AI-діагностика") має у H4 рядку маленький pill-badge `Скоро` (`--warning-bg` + `--warning` text).

**Copy — заголовки секції:**
- H2: `Все, що потрібно агроному в одному додатку`
- Lede: `Чотири ключові можливості Grano — в інтерфейсі, який зрозуміє будь-який фермер.`

**4 картки:**

| Заголовок | Опис | Icon | Screenshot crop |
|-----------|------|------|-----------------|
| Поля | Ведіть облік всіх своїх полів з культурами, сезонами та аналітикою врожайності. | `map-pinned` | Мої поля список |
| Магазин | Замовляйте насіння, добрива та засоби захисту напряму в додатку. Доставка Новою поштою або кур'єром. | `shopping-bag` | Каталог магазину |
| AI-діагностика (Скоро) | Сфотографуйте листок — отримайте діагноз проблеми рослини і рекомендації. | `sparkles` | AI-діагноз result |
| Погода | Точний прогноз по вашій області на 7 днів — плануйте польові роботи. | `cloud-sun` | Home screen з weather card |

### 8.4 Deep-dive sections (B — alternating zig-zag)

**Structure per section:**
```
┌────────────────────┬──────────────────────┐
│ [iPhone mockup або │ Н3: Заголовок        │
│  кадр зі скріна,   │                      │
│  shadow-mockup,    │ Lede 2-3 рядки опису │
│  без коробки]      │                      │
│                    │ Bullets (3):         │
│                    │ ✓ Перевага 1         │
│                    │ ✓ Перевага 2         │
│                    │ ✓ Перевага 3         │
└────────────────────┴──────────────────────┘
```

**Fon chergyyutsya:** секція 1 (Поля) — `--cream-50`, секція 2 (Магазин) — `--white`, секція 3 (AI) — `--cream-50`, секція 4 (Погода) — `--white`.

**Mockup placement alternates:** 1-ліворуч, 2-праворуч, 3-ліворуч, 4-праворуч.

**Mobile:** stacked, mockup always above text.

**Per-section copy** (placeholder, доопрацюємо при імпл.):

**Section: Поля**
- H3: `Всі поля — на одній карті`
- Lede: `Додавайте поля з точними межами, фіксуйте операції, відстежуйте культуру і сезон. Grano веде історію за вас.`
- Bullets:
  - `Додавайте поля вручну або через Google Maps`
  - `Історія культур, сівозміна, врожайність по роках`
  - `Сповіщення про ключові агрооперації в потрібний час`
- Screen: Мої поля / Поле №1 detail (alternating)

**Section: Магазин**
- H3: `Магазин агрохімії — в твоїй кишені`
- Lede: `Купуйте насіння, добрива і ЗЗР напряму. Каталог, кошик, онлайн-оплата, доставка Новою поштою — без дзвінків і переговорів.`
- Bullets:
  - `Великий каталог: насіння, добрива, засоби захисту`
  - `Доставка Новою поштою або кур'єром`
  - `Онлайн-оплата: Visa, Mastercard, GooglePay, ApplePay`
- Screen: Магазин / Кошик

**Section: AI-діагностика**
- H3: `Хвороби рослин — по одному фото` + pill `Скоро`
- Lede: `Сфотографуйте уражений листок — AI визначить проблему і запропонує план обробки. Без довідників, без здогадок.`
- Bullets:
  - `Розпізнавання основних хвороб і дефіцитів`
  - `Рівень ризику і рекомендовані заходи`
  - `Історія всіх діагностик за полем`
- Screen: AI-діагноз result (Борошниста роса)
- **Disclaimer small:** `AI-діагностика запрацює в повному обсязі в 2026 році.`

**Section: Погода**
- H3: `Прогноз по твоїй області`
- Lede: `Актуальна погода і прогноз на 7 днів — вмонтовані на головному екрані. Плануйте обробку без зайвих додатків.`
- Bullets:
  - `Точний прогноз через Open-Meteo API`
  - `Сповіщення про ризики (заморозки, зливи)`
  - `Інтеграція з завданнями — плануй по погоді`
- Screen: Home / weather card крупним планом

### 8.5 How It Works (A — horizontal 3-step timeline)

**Layout:**
```
H2: Як почати — три кроки
Lede: Менше 5 хвилин до повного налаштування господарства.

┌──────────┐  ···  ┌──────────┐  ···  ┌──────────┐
│ [1]      │ ····→│ [2]      │ ····→│ [3]      │
│ [icon]   │       │ [icon]   │       │ [icon]   │
│ Завантаж │       │ Створи   │       │ Користуй │
│ додаток  │       │ аккаунт  │       │          │
│ Опис     │       │ Опис     │       │ Опис     │
└──────────┘       └──────────┘       └──────────┘
```

Steps:
1. `Завантажте Grano` — `Безкоштовно в App Store або Google Play.`
2. `Створіть аккаунт` — `Ім'я, телефон, email — і ви готові.`
3. `Додайте поля і починайте` — `Grano візьме на себе облік, нагадування і аналітику.`

**Mobile:** vertical, connected by left-side vertical dotted line.

### 8.6 Social Proof (C — stats + 3 testimonials)

**Top row — 4 stat columns:**
```
[4 модулі]         [1000+ га]         [7 днів]         [UA]
ключових           під обліком        прогноз          тільки
можливостей        в системі          погоди           українська
```

**Small print під статами:** `Дані станом на запуск платформи, 2026 рік.`

**Bottom — 3 testimonials (no photos, initials only):**

Картка:
```
┌────────────────────────────────┐
│ "Цитата фермера 2-3 рядки"     │
│                                │
│ ─────                          │
│                                │
│ (О)  Олексій Ковальчук         │
│      Фермер, Полтавщина        │
│      Пшениця, 120 га           │
└────────────────────────────────┘
```

Avatar — круг 48px з однієї літери ініціалу, фон з rotated palette: `--green-500`, `--navy-700`, `--warning`.

**3 placeholder testimonials:**
- Олексій Ковальчук, фермер, Полтавщина — фокус на "облік полів"
- Марія Левченко, агроном, Вінниччина — фокус на "AI-діагностика"
- Василь Шевченко, керівник господарства, Черкащина — фокус на "магазин"

### 8.7 Final CTA Banner (B — dark full-bleed)

**Layout:** центровано, `--navy-900` фон, padding 120px vertical.

```
                    [Лого Grano — світлий варіант,
                     той самий що на dark splash]
                     
              H2 white: Грано — в твоєму телефоні
              
          Lede muted: Усі модулі безкоштовні. Без реклами.
          
              [App Store badge]  [Google Play badge]
```

Subtle: зверху і знизу банера — `1px` divider з `--green-500` на 20% opacity.

### 8.8 FAQ

**Layout:** max-width 800px, accordion (single-open), плюс subtle chevron, border-bottom `1px gray-200`.

**6 питань (ordered):**

1. **Чи додаток безкоштовний?**
   Так, Grano безкоштовний для всіх користувачів. Ви платите тільки за товари, які замовляєте в магазині.

2. **На яких телефонах працює Grano?**
   iPhone з iOS 13+ і Android 8.0+. Для більш старих пристроїв функціональність обмежена.

3. **Чи можна використовувати офлайн?**
   Так, основні функції (перегляд полів, завдань, нагадування) працюють офлайн. Магазин, AI-діагностика і погода потребують інтернету.

4. **Як працює AI-діагностика?**
   Ви фотографуєте уражений листок — AI аналізує фото, визначає ймовірну проблему і пропонує план обробки. Повна версія функції з'явиться в 2026 році.

5. **Як оформити замовлення в магазині?**
   Обираєте товар → додаєте в кошик → обираєте спосіб доставки (кур'єр або Нова пошта) → оплачуєте онлайн або післяплатою.

6. **Як зв'язатись з підтримкою?**
   Напишіть на `support@grano-app.com` або зателефонуйте `+380 44 123 45 67` (Пн–Пт 9:00–18:00). Також доступний розділ "Підтримка" в додатку.

### 8.9 Footer

**Layout:** `--navy-900` фон, padding 80px top / 40px bottom. 4 колонки на desktop, stacked на mobile.

```
Col 1:                   Col 2:        Col 3:         Col 4:
[Grano лого — white]     Продукт       Підтримка      Компанія
Твій цифровий            Можливості    Центр          Про Grano
агроном                  Як працює     підтримки      Grano.in.ua
                         FAQ           support@       (main site)
[App Store badge]                      grano-app.com
[Google Play badge]                    Telegram       Privacy
                                                      Terms

─────────────────────────── orn divider (тонка вишивка, 30% opacity white) ───────────────────────────

© 2026 ТОВ Грано. Всі права захищені.                     Зроблено Faynosoft
```

---

## 9. Sub-pages

### 9.1 /privacy — Політика конфіденційності

- Повна копія політики конфіденційності додатку (від юриста Grano)
- Формат: проста typography page, max-width 720px, навігація: Header + Footer
- Контент: заповнити реальний текст (зараз placeholder — *[потрібна версія від юриста]*)

### 9.2 /terms — Умови використання

- Аналогічно /privacy
- Зараз placeholder з базовим шаблоном, чекаємо реальний текст

### 9.3 /support — Підтримка

- Розширений FAQ (всі 6 питань + 6-8 додаткових по категоріях)
- Блок контактів: email, phone, форма зворотнього зв'язку (mailto для MVP, пізніше замінимо на endpoint)
- Посилання "Написати нам" → `mailto:support@grano-app.com`

---

## 10. Assets Inventory

### Що треба підготувати/експортувати з Figma додатково

- **Логотип Grano SVG** — SVG-файлу немає; у нас є два splash PNG в `landing/Дизайн/` (dark variant — wordmark білий на navy; light variant — wordmark navy на білому, з листком-"o"). Plan: при імплементації виконати ручну SVG-трасовку з PNG (текст можна замінити `<text>` + Comfortaa Bold, листок — path з трасовки), отримати два варіанти: `logo-dark.svg` (для темних фонів, wordmark білий) та `logo.svg` (для світлих, wordmark navy). Літера "o" завжди зелений листок (`--green-500`/`--green-700` gradient TBD при імплементації).
- **App icon** (favicon, OG image) — вже є в додатку; потрібен 512×512 PNG + SVG
- **Store badges** — офіційні з Apple/Google (download з їхніх design guidelines)
- **Screenshots iPhone mockups** — використовуємо вже наявні 33 скріни з `landing/Дизайн/`, потрібно буде вставити їх у device-frame (iPhone mockup). Device frame — SVG від Apple або через бібліотеку типу [screenshots.mobile-frame](https://github.com/krunal4081/iphone-mockups)
- **Orn divider SVG** — я створю SVG 1px з вишивковим мотивом вручну (спрощений хрестик repeat)

### Photos (variant A — мінімальний набір)

- **Hero background:** один кадр пшеничного поля з фермером — Unsplash search: `Ukrainian wheat field farmer sunset`. Референс: високоякісна, золота година, вертикальний або horizontal crop.
- **Fields deep-dive:** опціонально, фоновий кадр аграрного поля з висоти (dron angle) — треба чи ні, вирішимо в імплементації.

---

## 11. Responsive Breakpoints

Tailwind default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Design target:**
- Mobile-first (критично — цільова аудиторія користується смартфонами)
- Desktop 1280px — головний "pixel-perfect" target для презентації
- Tablet 768px — має бути красиво, але не оптимізуємо окремо

---

## 12. Performance & SEO

### Performance targets
- **LCP:** < 2.0s на 4G (мобільно)
- **CLS:** < 0.1
- **TBT:** < 200ms

### Techniques
- Static generation (SSG) — лендінг повністю статичний
- Images: `next/image` з `priority` на hero, lazy на rest, AVIF/WebP
- Fonts: `next/font` з preload + fallback
- No external JS (no analytics iframe, no chat-widget для MVP)

### SEO
- `<title>`: `Grano — твій цифровий агроном`
- `<meta description>`: `Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння. Безкоштовно.`
- Open Graph + Twitter Cards з hero-фото
- Structured data: `MobileApplication` schema.org
- `robots.txt`, `sitemap.xml`
- UA `lang="uk"` в `<html>`

---

## 13. Accessibility

- WCAG 2.1 AA як мінімум
- Contrast: green-500 на white = 2.4 → не AAA для body text, тому **не використовуємо як text color**, тільки як CTA-background або accent. Text завжди `navy-900` (> 8.0 contrast on white).
- Focus-visible rings на всіх interactive елементах — `--green-500` 2px outline + 2px offset
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>` для testimonials
- Всі зображення — `alt` українською, декоративні — `alt=""`
- Keyboard navigation tested (tab через hero → features → CTA)
- `prefers-reduced-motion` respected

---

## 14. Motion & Interactivity

**MVP approach:** мінімальна anim, тільки там де додає цінність.

- **Header scroll** — transparent → white bg на scroll > 80px
- **Cards hover** — `translateY(-4px) + shadow-card-lg`, transition 200ms ease-out
- **CTA buttons hover** — `background darken, subtle scale(1.02)`
- **Orn divider** — static SVG, no animation
- **Mockups** — static на MVP; якщо буде час → легкий parallax на scroll (Framer Motion)
- **Accordion FAQ** — smooth height transition, chevron rotate

**Без:** анімованих illustrations, scroll-triggered numbers, fancy page transitions.

---

## 15. Open Questions

1. ~~**Дизайн-система Section 1 з Figma** — треба витягти точні токени.~~ **Вирішено (2026-04-22):** Figma MCP недоступний (free tier користувача). Кольори фіксуємо з поточної секції 4 (візуальна оцінка з PNG splash-ів), шрифт — Comfortaa (підтверджено користувачем). Display-шрифт Unbounded — вибір лендінгу, в додатку не використовується.
2. **Privacy Policy / Terms текст** — чекаємо юридичний контент від Grano. На MVP — placeholder з дисклеймером.
3. **Real photos** — конкретні Unsplash URL підберемо при імплементації (2 фото).
4. **Hosting** — Vercel чи Netlify? Рекомендую Vercel (native Next.js). Остаточно погодимо перед deploy.
5. **Аналітика** — додавати Plausible/Umami/GA4 для MVP чи ні? Зараз рішення — **без** аналітики на старт, додамо пізніше коли буде потреба.
6. **Cookie banner** — якщо немає analytics і немає third-party cookies → не треба. Але GDPR/Ukrainian Law — треба перевірити.
7. **iPhone mockup frame** — знайти / купити якісну SVG-mockup-бібліотеку.
8. **Gradient на листку логотипа** — в PNG видно, що листок має перехід від світло-зеленого до темнішого. При SVG-трасовці вирішити: однокольоровий `--green-500` чи 2-stop gradient `--green-500` → `--green-700`.

---

## 16. Content Maintenance

**Hardcoded vs CMS:**
- MVP — весь контент у коді (TS constants у `/content/*.ts` модулях). FAQ, testimonials, features — статичні arrays.
- Якщо пізніше потрібна буде редакція без deploy → MDX files у repo (все ще git-based) або легкий CMS (Sanity/Payload).

---

## Locked-in decisions summary

| # | Decision | Choice |
|---|----------|--------|
| 1 | Primary audience & goal | Marketing landing + store compliance |
| 2 | Tech stack | Next.js App Router + Tailwind + TS |
| 3 | Language | UA only |
| 4 | Aesthetic | Variant B — stay close to app brand + Ukrainian touch |
| 5 | Domain | grano-app.com |
| 6 | Divider accent | D — Ukrainian embroidery 1px SVG pattern |
| 7 | Typography | B — Unbounded (display) + Comfortaa (body/UI) |
| 8 | Hero | C+twik — split text/mockup + wheat field blur bg |
| 9 | Features 4 cards | C — icon + screen crop cards |
| 10 | Deep-dive pattern | B — alternating + cream/white chergyyutsya |
| 11 | How it works | A — horizontal 3-step timeline |
| 12 | Social proof | C — stats row + 3 testimonials |
| 13 | Testimonial avatars | C — initials only, no photos |
| 14 | Final CTA | B — dark navy full-bleed |
| 15 | Real photos count | A — minimal (1-2 photos) |

---

**Next step:** Після того як ти переглянеш цей spec і підтвердиш (або попросиш зміни) → я запускаю `superpowers:writing-plans` для формування плану імплементації.
