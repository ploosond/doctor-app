// Internal — do not import directly. Use the public API in ./index.ts.

import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { AppointmentModel } from "@/models/appointment"
import { VisitModel } from "@/models/visit"
import { hasConflict } from "@/lib/services/booking"
import { notifyNewRequest, notifyConfirmed, notifyCancelled } from "@/lib/services/notifications"

export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled" | "no_show"
export type AppointmentMode = "in_person" | "video"

export type CreateAppointmentInput = {
  patientRef: string
  service: string
  mode: AppointmentMode
  status: AppointmentStatus
  slotStart: Date
  slotEnd: Date
}

export type UpdateAppointmentInput = {
  service: string
  mode: AppointmentMode
  slotStart: Date
  slotEnd: Date
}

export type AppointmentRecord = {
  _id: mongoose.Types.ObjectId
  service: string
  mode: string
  status: string
  slotStart: Date
  slotEnd: Date
  notes?: string
  patientRef: unknown
  createdAt: Date
}

export type VisitRecord = {
  _id: mongoose.Types.ObjectId
  visitDate: Date
  notes?: string
  diagnosis?: string
  medication?: string
  followUpDate?: Date
}

// ── Reads ───────────────────────────────────────────────────────────────────

export async function listAppointments(filter: { status?: string } = {}): Promise<AppointmentRecord[]> {
  await connectDB()
  const query: Record<string, unknown> = {}
  if (filter.status) query.status = filter.status
  return (await AppointmentModel.find(query)
    .sort({ slotStart: -1 })
    .populate("patientRef", "name phone")
    .lean()) as unknown as AppointmentRecord[]
}

export async function getAppointment(id: string): Promise<AppointmentRecord | null> {
  await connectDB()
  return (await AppointmentModel.findById(id)
    .populate("patientRef", "name phone email gender dateOfBirth")
    .lean()) as unknown as AppointmentRecord | null
}

export async function visitsForAppointment(appointmentId: string): Promise<VisitRecord[]> {
  await connectDB()
  return (await VisitModel.find({ appointmentRef: appointmentId })
    .sort({ visitDate: -1 })
    .lean()) as unknown as VisitRecord[]
}

export async function recentAppointments(limit = 5): Promise<AppointmentRecord[]> {
  await connectDB()
  return (await AppointmentModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("patientRef", "name phone")
    .lean()) as unknown as AppointmentRecord[]
}

export async function appointmentStats(): Promise<{ today: number; pending: number; week: number }> {
  await connectDB()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())

  const [today, pending, week] = await Promise.all([
    AppointmentModel.countDocuments({ slotStart: { $gte: todayStart } }),
    AppointmentModel.countDocuments({ status: "requested" }),
    AppointmentModel.countDocuments({ slotStart: { $gte: weekStart } }),
  ])
  return { today, pending, week }
}

// ── Mutations ───────────────────────────────────────────────────────────────

export async function createAppointment(input: CreateAppointmentInput): Promise<string> {
  await connectDB()
  if (await hasConflict(input.slotStart, input.slotEnd)) {
    throw new Error("That slot conflicts with an existing appointment.")
  }
  const doc = await AppointmentModel.create(input)
  if (input.status === "confirmed") await notifyConfirmed(String(doc._id))
  else if (input.status === "requested") await notifyNewRequest(String(doc._id))
  return String(doc._id)
}

export async function updateAppointment(id: string, input: UpdateAppointmentInput): Promise<void> {
  await connectDB()
  if (await hasConflict(input.slotStart, input.slotEnd, id)) {
    throw new Error("That slot conflicts with an existing appointment.")
  }
  await AppointmentModel.findByIdAndUpdate(id, input)
}

export async function deleteAppointment(id: string): Promise<void> {
  await connectDB()
  await AppointmentModel.findByIdAndDelete(id)
}

export async function setStatus(id: string, status: string): Promise<void> {
  await connectDB()
  await AppointmentModel.findByIdAndUpdate(id, { status })
  if (status === "confirmed") await notifyConfirmed(id)
  else if (status === "cancelled") await notifyCancelled(id)
}

export async function setNotes(id: string, notes: string): Promise<void> {
  await connectDB()
  await AppointmentModel.findByIdAndUpdate(id, { notes })
}
