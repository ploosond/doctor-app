"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as appointments from "@/lib/services/appointments"
import type { AppointmentMode, AppointmentStatus } from "@/lib/services/appointments"
import { getAvailableSlotsForDate, type Slot } from "@/lib/services/booking"
import { requireSession } from "@/lib/auth-guard"

export type AdminSlot = { startISO: string; endISO: string; label: string; startLabel: string; endLabel: string }

function timeLabel(d: Date) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function toAdminSlots(slots: Slot[]): AdminSlot[] {
  return slots.map((s) => ({
    startISO: new Date(s.start).toISOString(),
    endISO: new Date(s.end).toISOString(),
    label: `${timeLabel(s.start)}–${timeLabel(s.end)}`,
    startLabel: timeLabel(s.start),
    endLabel: timeLabel(s.end),
  }))
}

export async function adminGetSlots(dateISO: string, excludeId?: string): Promise<AdminSlot[]> {
  await requireSession()
  if (!dateISO) return []
  return toAdminSlots(await getAvailableSlotsForDate(dateISO, excludeId))
}

function parseSlot(fd: FormData): { slotStart: Date; slotEnd: Date } {
  const slot = (fd.get("slot") as string)?.trim() // "startISO|endISO"
  const [startISO, endISO] = (slot ?? "").split("|")
  return { slotStart: new Date(startISO), slotEnd: new Date(endISO) }
}

export async function createAppointment(fd: FormData) {
  await requireSession()
  const patientRef = (fd.get("patientRef") as string)?.trim()
  const service = (fd.get("service") as string)?.trim()
  const mode = ((fd.get("mode") as string) || "in_person") as AppointmentMode
  const status = ((fd.get("status") as string) || "confirmed") as AppointmentStatus
  const slotRaw = (fd.get("slot") as string)?.trim()
  if (!patientRef || !service || !slotRaw) throw new Error("Patient, service and slot are required.")

  const { slotStart, slotEnd } = parseSlot(fd)
  const id = await appointments.createAppointment({ patientRef, service, mode, status, slotStart, slotEnd })

  revalidatePath("/admin/appointments")
  revalidatePath("/admin/dashboard")
  redirect(`/admin/appointments/${id}?flash=created`)
}

export async function updateAppointment(id: string, fd: FormData) {
  await requireSession()
  const service = (fd.get("service") as string)?.trim()
  const mode = ((fd.get("mode") as string) || "in_person") as AppointmentMode
  const slotRaw = (fd.get("slot") as string)?.trim()
  if (!service || !slotRaw) throw new Error("Service and slot are required.")

  const { slotStart, slotEnd } = parseSlot(fd)
  await appointments.updateAppointment(id, { service, mode, slotStart, slotEnd })

  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  revalidatePath("/admin/dashboard")
  redirect(`/admin/appointments/${id}?flash=updated`)
}

export async function deleteAppointment(id: string) {
  await requireSession()
  await appointments.deleteAppointment(id)
  revalidatePath("/admin/appointments")
  revalidatePath("/admin/dashboard")
  redirect("/admin/appointments?flash=deleted")
}

export async function updateAppointmentStatus(id: string, status: string) {
  await requireSession()
  await appointments.setStatus(id, status)
  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  revalidatePath("/admin/dashboard")
  redirect(`/admin/appointments/${id}?flash=status`)
}

const STATUSES: AppointmentStatus[] = ["requested", "confirmed", "completed", "cancelled", "no_show"]

export async function overrideAppointmentStatus(id: string, status: string) {
  await requireSession()
  if (!STATUSES.includes(status as AppointmentStatus)) throw new Error("Invalid status.")
  await appointments.setStatus(id, status, { silent: true })
  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  revalidatePath("/admin/dashboard")
  redirect(`/admin/appointments/${id}?flash=status`)
}

export async function updateAppointmentNotes(id: string, notes: string) {
  await requireSession()
  await appointments.setNotes(id, notes)
  revalidatePath(`/admin/appointments/${id}`)
  redirect(`/admin/appointments/${id}?flash=notes`)
}
