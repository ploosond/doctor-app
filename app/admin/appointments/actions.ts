"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as appointments from "@/lib/services/appointments"
import type { AppointmentMode, AppointmentStatus } from "@/lib/services/appointments"
import { requireSession } from "@/lib/auth-guard"

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
  redirect(`/admin/appointments/${id}`)
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
  redirect(`/admin/appointments/${id}`)
}

export async function deleteAppointment(id: string) {
  await requireSession()
  await appointments.deleteAppointment(id)
  revalidatePath("/admin/appointments")
  revalidatePath("/admin/dashboard")
  redirect("/admin/appointments")
}

export async function updateAppointmentStatus(id: string, status: string) {
  await requireSession()
  await appointments.setStatus(id, status)
  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  revalidatePath("/admin/dashboard")
}

export async function updateAppointmentNotes(id: string, notes: string) {
  await requireSession()
  await appointments.setNotes(id, notes)
  revalidatePath(`/admin/appointments/${id}`)
}
