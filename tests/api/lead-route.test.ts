// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/lead/route";

const post = (body: unknown) =>
  POST(new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));

const lead = { name: "Іван", phone: "0667975007", region: "Полтавська", utm: { utm_source: "dealer-17" } };

describe("POST /api/lead", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "-100500");
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("sends the lead to the managers' chat", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await post(lead);
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bot123:abc/sendMessage");
    const sent = JSON.parse(init.body);
    expect(sent.chat_id).toBe("-100500");
    expect(sent.text).toContain("Телефон: +380667975007");
    expect(sent.text).toContain("utm_source=dealer-17");
  });

  it("rejects invalid fields without calling Telegram", async () => {
    const res = await post({ name: "", phone: "1" });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ fields: { name: true, phone: true } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    expect((await post("not json")).status).toBe(400);
  });

  it("answers a honeypot submission with success and sends nothing", async () => {
    const res = await post({ ...lead, website: "http://spam" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports 503 when Telegram is not configured", async () => {
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    expect((await post(lead)).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports 502 when Telegram refuses the message", async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":false}', { status: 403 }));
    expect((await post(lead)).status).toBe(502);
  });

  it("reports 502 when Telegram is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect((await post(lead)).status).toBe(502);
  });
});
