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
