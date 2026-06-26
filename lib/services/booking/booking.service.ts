// Internal — do not import directly. Use the public API in ./index.ts.

import { connectDB } from "@/lib/db"
import { AvailabilityModel } from "@/models/availability"
import { AppointmentModel } from "@/models/appointment"
import { PatientModel } from "@/models/patient"
import { notifyNewRequest } from "@/lib/services/notifications"
import { generateSlots, type Slot } from "./slots.helper"

type AvailabilityLike = {
  workingHours: { day: number; start: string; end: string; enabled?: boolean }[]
  slotDurationMins: number
  bufferMins: number
  blockedDates: (Date | string)[]
}

const DEFAULT_AVAILABILITY = {
  workingHours: [],
  slotDurationMins: 30,
  bufferMins: 10,
  blockedDates: [] as Date[],
}

const ACTIVE_STATUSES = ["requested", "confirmed"] as const

function dayBounds(dateISO: string): { start: Date; end: Date } {
  const start = new Date(`${dateISO}T00:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

export async function getAvailableSlotsForDate(
  dateISO: string,
  excludeAppointmentId?: string
): Promise<Slot[]> {
  await connectDB()

  const availability = ((await AvailabilityModel.findById("singleton").lean()) ??
    DEFAULT_AVAILABILITY) as unknown as AvailabilityLike
  const { start, end } = dayBounds(dateISO)

  const query: Record<string, unknown> = {
    status: { $in: ACTIVE_STATUSES },
    slotStart: { $gte: start, $lt: end },
  }
  if (excludeAppointmentId) query._id = { $ne: excludeAppointmentId }

  const booked = await AppointmentModel.find(query).select("slotStart slotEnd").lean()

  return generateSlots(dateISO, availability, booked)
}

export type BookingPayload = {
  name: string
  phone: string
  email?: string
  service: string
  reason?: string
  slotStartISO: string
  slotEndISO: string
  consent: boolean
}

export type BookingResult = { ok: true } | { ok: false; reason: "invalid" | "slot_taken" }

/** Public-booking write path: find-or-create patient, create a requested appointment, notify the clinic. */
export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const name = payload.name?.trim()
  const phone = payload.phone?.trim()
  const email = payload.email?.trim()
  const reason = payload.reason?.trim()

  if (!name || !phone || !payload.service || !payload.slotStartISO || !payload.slotEndISO || !payload.consent) {
    return { ok: false, reason: "invalid" }
  }

  const slotStart = new Date(payload.slotStartISO)
  const slotEnd = new Date(payload.slotEndISO)
  if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
    return { ok: false, reason: "invalid" }
  }

  await connectDB()

  if (await hasConflict(slotStart, slotEnd)) {
    return { ok: false, reason: "slot_taken" }
  }

  let patient = await PatientModel.findOne({ phone, deletedAt: null })
  if (patient) {
    if (!patient.name && name) patient.name = name
    if (!patient.email && email) patient.email = email
    if (!patient.consentGiven) {
      patient.consentGiven = true
      patient.consentAt = new Date()
    }
    await patient.save()
  } else {
    patient = await PatientModel.create({
      name,
      phone,
      email,
      consentGiven: true,
      consentAt: new Date(),
    })
  }

  const appt = await AppointmentModel.create({
    patientRef: patient._id,
    service: payload.service,
    mode: "in_person",
    status: "requested",
    slotStart,
    slotEnd,
    notes: reason ? `Booking reason: ${reason}` : undefined,
  })

  await notifyNewRequest(String(appt._id))
  return { ok: true }
}

export async function hasConflict(
  slotStart: Date,
  slotEnd: Date,
  excludeAppointmentId?: string
): Promise<boolean> {
  await connectDB()
  const query: Record<string, unknown> = {
    status: { $in: ACTIVE_STATUSES },
    slotStart: { $lt: slotEnd },
    slotEnd: { $gt: slotStart },
  }
  if (excludeAppointmentId) query._id = { $ne: excludeAppointmentId }

  const conflict = await AppointmentModel.findOne(query).lean()
  return !!conflict
}
