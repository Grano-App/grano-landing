// Заявка з форми на головній: перевірка на клієнті й на сервері, текст для Telegram.

export const REGIONS = [
  "Вінницька", "Волинська", "Дніпропетровська", "Донецька", "Житомирська", "Закарпатська",
  "Запорізька", "Івано-Франківська", "Київська", "Кіровоградська", "Луганська", "Львівська",
  "Миколаївська", "Одеська", "Полтавська", "Рівненська", "Сумська", "Тернопільська",
  "Харківська", "Херсонська", "Хмельницька", "Черкаська", "Чернівецька", "Чернігівська",
] as const;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

export type Lead = {
  name: string;
  phone: string; // +380XXXXXXXXX
  farm: string;
  region: string;
  utm: Utm;
  page: string;
};

export type LeadErrors = Partial<Record<"name" | "phone", true>>;

const MAX = { name: 80, farm: 120, utm: 100, page: 200 };

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Приводить український номер до +380XXXXXXXXX або повертає null. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/**
 * Перевіряє сирі дані форми. Повертає заявку або помилки полів.
 * `website` — приманка для ботів: заповнена означає спам, і заявку мовчки відкидаємо.
 */
export function parseLead(input: unknown):
  | { ok: true; lead: Lead }
  | { ok: false; errors: LeadErrors }
  | { ok: false; spam: true } {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  if (text(data.website, 200)) return { ok: false, spam: true };

  const name = text(data.name, MAX.name);
  const phone = normalizePhone(text(data.phone, 40));
  const errors: LeadErrors = {};
  if (!name) errors.name = true;
  if (!phone) errors.phone = true;
  if (errors.name || errors.phone) return { ok: false, errors };

  const region = text(data.region, 40);
  const rawUtm = (data.utm && typeof data.utm === "object" ? data.utm : {}) as Record<string, unknown>;
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = text(rawUtm[key], MAX.utm);
    if (value) utm[key] = value;
  }

  return {
    ok: true,
    lead: {
      name,
      phone: phone!,
      farm: text(data.farm, MAX.farm),
      region: (REGIONS as readonly string[]).includes(region) ? region : "",
      utm,
      page: text(data.page, MAX.page),
    },
  };
}

/** Текст повідомлення в Telegram-чат менеджерів (без розмітки, щоб не екранувати). */
export function formatLeadMessage(lead: Lead): string {
  const lines = [
    "Нова заявка з grano-app.com",
    "",
    `Ім'я: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Господарство: ${lead.farm || "—"}`,
    `Область: ${lead.region || "—"}`,
  ];
  const utm = UTM_KEYS.filter((k) => lead.utm[k]).map((k) => `${k}=${lead.utm[k]}`);
  if (utm.length) lines.push("", `Джерело: ${utm.join(", ")}`);
  if (lead.page) lines.push(`Сторінка: ${lead.page}`);
  return lines.join("\n");
}
