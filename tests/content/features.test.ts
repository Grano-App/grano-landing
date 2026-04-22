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
