"use client";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  question: string;
  answer: string;
};

export function AccordionItem({ id, question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-h4 font-bold text-navy-900"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-navy-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        role="region"
        id={panelId}
        hidden={!open}
        className="pb-5 pr-8 text-base text-navy-700"
      >
        {answer}
      </div>
    </div>
  );
}
