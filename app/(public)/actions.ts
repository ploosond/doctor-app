"use server"

import { revalidatePath } from "next/cache"
import { getAvailableSlotsForDate, createBooking, type BookingPayload, type BookingResult } from "@/lib/services/booking"
import { rateLimit, clientIp } from "@/lib/rate-limit"

// Reject submissions that arrive sooner than a human could plausibly fill the form.
const MIN_FILL_MS = 3000

function timeLabel(d: Date) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

export type PublicSlot = { startISO: string; endISO: string; label: string; startLabel: string; endLabel: string }

export async function getSlots(dateISO: string): Promise<PublicSlot[]> {
  if (!dateISO) return []
  const ip = await clientIp()
  if (!rateLimit(`slots:${ip}`, { limit: 30, windowMs: 60_000 }).ok) return []
  const slots = await getAvailableSlotsForDate(dateISO)
  return slots.map((s) => ({
    startISO: new Date(s.start).toISOString(),
    endISO: new Date(s.end).toISOString(),
    label: `${timeLabel(s.start)}–${timeLabel(s.end)}`,
    startLabel: timeLabel(s.start),
    endLabel: timeLabel(s.end),
  }))
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  // Bot signals: honeypot filled, or submitted implausibly fast → pretend success,
  // write nothing, so automated abuse gets no signal to adapt to.
  const tooFast = typeof payload.renderedAt === "number" && Date.now() - payload.renderedAt < MIN_FILL_MS
  if ((payload.hp ?? "").trim() !== "" || tooFast) {
    return { ok: true }
  }

  const ip = await clientIp()
  if (!rateLimit(`booking:${ip}`, { limit: 5, windowMs: 60 * 60_000 }).ok) {
    return { ok: false, reason: "rate_limited" }
  }

  // createBooking only reads the named booking fields; hp/renderedAt are ignored & never persisted.
  const res = await createBooking(payload)
  if (res.ok) {
    revalidatePath("/admin/appointments")
    revalidatePath("/admin/dashboard")
  }
  return res
}
