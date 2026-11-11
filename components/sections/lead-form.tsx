"use client";
import { useState } from "react";
import Link from "next/link";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-field";
import { leadForm } from "@/content/landing";
import { readUtm, track } from "@/lib/analytics";
import { REGIONS, parseLead, type LeadErrors } from "@/lib/lead";

type Status = "idle" | "sending" | "sent" | "error";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<LeadErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      phone: form.get("phone"),
      farm: form.get("farm"),
      region: form.get("region"),
      website: form.get("website"),
      utm: readUtm(),
      page: window.location.pathname,
    };
    const parsed = parseLead(payload);
    if (!parsed.ok && "errors" in parsed) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`lead: ${res.status}`);
      setStatus("sent");
      track("generate_lead", { region: parsed.ok ? parsed.lead.region : "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-card bg-green-50 p-10 text-center">
        <CircleCheck className="h-12 w-12 text-green-700" aria-hidden="true" />
        <p className="text-h4 font-bold text-navy-900">{leadForm.sent}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5 rounded-card bg-white p-6 shadow-card md:p-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField id="name" label="Ім'я" required autoComplete="name" placeholder="Як до вас звертатися" error={errors.name && leadForm.errors.name} />
        <TextField id="phone" label="Телефон" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+380" error={errors.phone && leadForm.errors.phone} />
        <TextField id="farm" label="Назва господарства" autoComplete="organization" placeholder="Наприклад, ФГ «Колос»" />
        <SelectField id="region" label="Область" placeholder="Оберіть область" options={REGIONS} />
      </div>
      {/* Приманка для ботів: людина цього поля не бачить. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {status === "error" && (
        <p role="alert" className="flex items-start gap-3 rounded-input bg-danger-bg p-4 text-sm text-navy-900">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          {leadForm.error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full md:w-auto md:self-start">
        {status === "sending" ? leadForm.sending : leadForm.submit}
      </Button>
      <p className="text-xs text-navy-500">
        {leadForm.consent}{" "}
        <Link href="/privacy" className="underline">{leadForm.consentLink}</Link>.
      </p>
    </form>
  );
}
