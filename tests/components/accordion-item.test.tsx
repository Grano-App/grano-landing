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
