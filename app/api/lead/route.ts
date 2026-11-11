import { NextResponse } from "next/server";
import { formatLeadMessage, parseLead } from "@/lib/lead";

// POST /api/lead — приймає заявку з форми й пересилає її в Telegram-чат менеджерів.
// Потрібні змінні середовища TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID (див. README).

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const parsed = parseLead(body);
  if (!parsed.ok) {
    // Спам отримує той самий успіх, що й людина, щоб бот не підлаштовувався.
    if ("spam" in parsed) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "invalid", fields: parsed.errors }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("lead: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: formatLeadMessage(parsed.lead) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("lead: telegram responded", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
  } catch (error) {
    console.error("lead: telegram request failed", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
