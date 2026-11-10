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
    const btn = page.getByRole("button", { name: /Скільки коштує Grano/ });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/перший місяць користування — безкоштовні/)).toBeVisible();
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
    await page.goto("/");
    const { status, body } = await page.evaluate(async () => {
      const r = await fetch("/sitemap.xml");
      return { status: r.status, body: await r.text() };
    });
    expect(status).toBe(200);
    expect(body.match(/<url>/g)?.length).toBe(4);
  });
});
