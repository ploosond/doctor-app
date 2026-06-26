"use server"

import { revalidatePath } from "next/cache"
import { getAvailableSlotsForDate, createBooking, type BookingPayload, type BookingResult } from "@/lib/services/booking"

function timeLabel(d: Date) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

export type PublicSlot = { startISO: string; endISO: string; label: string; startLabel: string; endLabel: string }

export async function getSlots(dateISO: string): Promise<PublicSlot[]> {
  if (!dateISO) return []
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
  const res = await createBooking(payload)
  if (res.ok) {
    revalidatePath("/admin/appointments")
    revalidatePath("/admin/dashboard")
  }
  return res
}
