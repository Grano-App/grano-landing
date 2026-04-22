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
