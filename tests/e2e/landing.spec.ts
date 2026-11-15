import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Grano landing", () => {
  test("homepage renders with key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /Усе господарство в одній системі/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Видно, куди пішло пальне/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Як почати/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Залиште заявку/ })).toBeVisible();
  });

  test("FAQ accordion expands", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /Скільки коштує Grano/ });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("region").filter({ hasText: "Про умови після першого місяця" })).toBeVisible();
  });

  test("lead form shows field errors and sends a valid lead", async ({ page }) => {
    await page.route("**/api/lead", (route) => route.fulfill({ status: 200, json: { ok: true } }));
    await page.goto("/#lead");
    await page.getByRole("button", { name: "Надіслати заявку" }).click();
    await expect(page.getByText("Вкажіть ім'я")).toBeVisible();
    await page.getByRole("textbox", { name: "Ім'я", exact: true }).fill("Іван");
    await page.getByRole("textbox", { name: "Телефон", exact: true }).fill("066 797 50 07");
    await page.getByRole("button", { name: "Надіслати заявку" }).click();
    await expect(page.getByRole("status")).toContainText("зателефонує");
  });

  test("lead form tells the visitor to call when sending fails", async ({ page }) => {
    await page.route("**/api/lead", (route) => route.fulfill({ status: 502, json: { ok: false } }));
    await page.goto("/#lead");
    await page.getByRole("textbox", { name: "Ім'я", exact: true }).fill("Іван");
    await page.getByRole("textbox", { name: "Телефон", exact: true }).fill("0667975007");
    await page.getByRole("button", { name: "Надіслати заявку" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Не вдалося надіслати" })).toContainText("+380 66 797 50 07");
  });

  test("sub-pages are reachable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /Політика конфіденційності/ })).toBeVisible();
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Умови використання/ })).toBeVisible();
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: /Центр підтримки/ })).toBeVisible();
  });

  test("store badges link to the published listings", async ({ page }) => {
    await page.goto("/");
    const appStore = page.getByRole("link", { name: /App Store/i }).first();
    await expect(appStore).toHaveAttribute("href", /apps\.apple\.com\/ua\/app\/grano-agro\/id6787681145/);
    const playStore = page.getByRole("link", { name: /Google Play/i }).first();
    await expect(playStore).toHaveAttribute("href", /play\.google\.com\/store\/apps\/details\?id=grano\.app\.com/);
  });

  test("App Store and Google Play badges have the same width in every placement", async ({ page }) => {
    await page.goto("/");
    const widths = await page.locator('a[data-track="click_store"] img').evaluateAll((imgs) =>
      imgs.map((img) => ({ label: img.closest("a")!.dataset.trackLabel!, width: img.getBoundingClientRect().width }))
    );
    for (const placement of ["start", "footer"]) {
      const appStore = widths.find((w) => w.label === `app_store_${placement}`)!;
      const playStore = widths.find((w) => w.label === `google_play_${placement}`)!;
      expect(appStore.width).toBeGreaterThan(0);
      expect(playStore.width).toBeCloseTo(appStore.width, 0);
    }
  });

  test("every phone screenshot sits in the same iPhone frame", async ({ page }) => {
    await page.goto("/");
    // Рамка — дід скріншота в IPhoneMockup: відступ екрана й радіус кутів відносно ширини рамки мають збігатися всюди.
    const frames = await page.locator('img[alt^="Застосунок:"]').evaluateAll((imgs) =>
      imgs
        .map((img) => ({ screen: img.parentElement!, frame: img.parentElement!.parentElement! }))
        .filter(({ frame }) => frame.getBoundingClientRect().width > 0)
        .map(({ screen, frame }) => {
          const box = frame.getBoundingClientRect();
          return {
            inset: (screen.getBoundingClientRect().left - box.left) / box.width,
            radius: parseFloat(getComputedStyle(frame).borderTopLeftRadius) / box.width,
          };
        })
    );
    expect(frames.length).toBeGreaterThan(1);
    for (const frame of frames) {
      expect(frame.inset).toBeCloseTo(frames[0].inset, 2);
      expect(frame.radius).toBeCloseTo(frames[0].radius, 2);
    }
  });

  test("footer logo keeps its proportions", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator("footer").getByRole("img", { name: "Grano" }).boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(714 / 174, 1);
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
