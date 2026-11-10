"use client";
import { useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { form, regions, type FormState } from "./fixtures";

// Прототип: нічого не надсилає. Стан задає ?state=… або кнопка «Надіслати».
// TextField і SelectField — прогалини кіту (README «Kit gaps»), на етапі 3 переїдуть у components/ui.

function TextField({
  id, label, required, placeholder, error, type = "text", defaultValue,
}: {
  id: string; label: string; required?: boolean; placeholder?: string; error?: string; type?: string; defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-navy-900">
        {label}{required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-14 rounded-input border bg-white px-5 text-base text-navy-900 placeholder:text-gray-400",
          error ? "border-danger" : "border-gray-200 focus:border-green-700"
        )}
      />
      {error && <p id={`${id}-error`} className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function SelectField({ id, label, options }: { id: string; label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-navy-900">{label}</label>
      <select
        id={id}
        name={id}
        defaultValue=""
        className="h-14 rounded-input border border-gray-200 bg-white px-5 text-base text-navy-900"
      >
        <option value="" disabled>Оберіть область</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function LeadForm({ initial }: { initial: FormState }) {
  const [state, setState] = useState<FormState>(initial);

  if (state === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-card bg-green-50 p-10 text-center">
        <CircleCheck className="h-12 w-12 text-green-700" aria-hidden="true" />
        <p className="text-h4 font-bold text-navy-900">{form.sent}</p>
      </div>
    );
  }

  const invalid = state === "invalid";
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState("sending");
        setTimeout(() => setState("sent"), 1200);
      }}
      className="flex flex-col gap-5 rounded-card bg-white p-6 shadow-card md:p-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField id="name" label="Ім'я" required placeholder="Як до вас звертатися" error={invalid ? form.errors.name : undefined} />
        <TextField id="phone" label="Телефон" required type="tel" placeholder="+380" defaultValue={invalid ? "+38067" : undefined} error={invalid ? form.errors.phone : undefined} />
        <TextField id="farm" label="Назва господарства" placeholder="Наприклад, ФГ «Колос»" />
        <SelectField id="region" label="Область" options={regions} />
      </div>
      {state === "error" && (
        <p role="alert" className="flex items-start gap-3 rounded-input bg-danger-bg p-4 text-sm text-navy-900">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          {form.error}
        </p>
      )}
      <Button type="submit" size="lg" className={cn("w-full md:w-auto md:self-start", state === "sending" && "pointer-events-none opacity-70")}>
        {state === "sending" ? "Надсилаємо…" : form.submit}
      </Button>
      <p className="text-xs text-navy-500">{form.consent}</p>
    </form>
  );
}
