import { describe, expect, it } from "vitest";
import { formatLeadMessage, normalizePhone, parseLead } from "@/lib/lead";

describe("normalizePhone", () => {
  it.each([
    ["+380 66 797 50 07", "+380667975007"],
    ["380667975007", "+380667975007"],
    ["066 797-50-07", "+380667975007"],
    ["(066) 7975007", "+380667975007"],
  ])("accepts %s", (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });

  it.each(["", "+38067", "+3806679750071", "+48 600 700 800", "66797500"])("rejects %s", (raw) => {
    expect(normalizePhone(raw)).toBeNull();
  });
});

describe("parseLead", () => {
  const valid = { name: "Іван", phone: "0667975007", farm: "ФГ Колос", region: "Полтавська" };

  it("requires name and a valid phone, reporting both at once", () => {
    expect(parseLead({ name: "  ", phone: "123" })).toEqual({ ok: false, errors: { name: true, phone: true } });
  });

  it("returns a normalized lead", () => {
    const result = parseLead({ ...valid, name: "  Іван  " });
    expect(result).toEqual({
      ok: true,
      lead: { name: "Іван", phone: "+380667975007", farm: "ФГ Колос", region: "Полтавська", utm: {}, page: "" },
    });
  });

  it("drops a region that is not a Ukrainian oblast", () => {
    const result = parseLead({ ...valid, region: "<script>" });
    expect(result.ok && result.lead.region).toBe("");
  });

  it("keeps only known UTM keys", () => {
    const result = parseLead({ ...valid, utm: { utm_source: "dealer-17", utm_campaign: "qr", evil: "x" } });
    expect(result.ok && result.lead.utm).toEqual({ utm_source: "dealer-17", utm_campaign: "qr" });
  });

  it("flags a filled honeypot as spam even when the rest is valid", () => {
    expect(parseLead({ ...valid, website: "http://spam" })).toEqual({ ok: false, spam: true });
  });

  it("caps long fields", () => {
    const result = parseLead({ ...valid, name: "я".repeat(500) });
    expect(result.ok && result.lead.name).toHaveLength(80);
  });
});

describe("formatLeadMessage", () => {
  it("lists contact fields and the traffic source", () => {
    const parsed = parseLead({
      name: "Іван",
      phone: "0667975007",
      region: "Полтавська",
      utm: { utm_source: "dealer-17" },
      page: "/",
    });
    if (!parsed.ok) throw new Error("expected valid lead");
    const text = formatLeadMessage(parsed.lead);
    expect(text).toContain("Ім'я: Іван");
    expect(text).toContain("Телефон: +380667975007");
    expect(text).toContain("Господарство: —");
    expect(text).toContain("Область: Полтавська");
    expect(text).toContain("Джерело: utm_source=dealer-17");
  });
});
