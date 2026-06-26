// Internal — do not import directly. Use the public API in ./index.ts.

import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import { PatientModel } from "@/models/patient"
import { VisitModel } from "@/models/visit"

export type Gender = "male" | "female" | "other" | "prefer_not_to_say"

export type PatientInput = {
  name: string
  phone: string
  email?: string
  dateOfBirth?: Date
  gender?: Gender
  address?: string
  occupation?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  referralSource?: string
  alerts?: string
  consentGiven: boolean
}

export type VisitInput = {
  visitDate: Date
  notes?: string
  diagnosis?: string
  medication?: string
  followUpDate?: Date
  appointmentRef?: string
}

export type PatientRecord = {
  _id: mongoose.Types.ObjectId
  name: string
  phone: string
  email?: string
  dateOfBirth?: Date
  gender?: Gender
  address?: string
  occupation?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  referralSource?: string
  alerts?: string
  consentGiven?: boolean
  notes?: string
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type VisitRecord = {
  _id: mongoose.Types.ObjectId
  patientRef: mongoose.Types.ObjectId
  appointmentRef?: mongoose.Types.ObjectId
  visitDate: Date
  notes?: string
  diagnosis?: string
  medication?: string
  followUpDate?: Date
}

export type LatestVisit = { _id: unknown; lastVisit?: Date; lastFollowUp?: Date }

// ── Reads ───────────────────────────────────────────────────────────────────

export async function listPatients(opts: { q?: string; deleted?: boolean } = {}): Promise<PatientRecord[]> {
  await connectDB()
  const filter: Record<string, unknown> = opts.deleted ? { deletedAt: { $ne: null } } : { deletedAt: null }
  if (opts.q) {
    filter.$or = [
      { name: { $regex: opts.q, $options: "i" } },
      { phone: { $regex: opts.q, $options: "i" } },
      { email: { $regex: opts.q, $options: "i" } },
    ]
  }
  return (await PatientModel.find(filter).sort({ createdAt: -1 }).lean()) as unknown as PatientRecord[]
}

export async function getPatient(id: string): Promise<PatientRecord | null> {
  await connectDB()
  return (await PatientModel.findById(id).lean()) as unknown as PatientRecord | null
}

export async function countActivePatients(): Promise<number> {
  await connectDB()
  return PatientModel.countDocuments({ deletedAt: null })
}

export async function listVisitsByPatient(patientId: string): Promise<VisitRecord[]> {
  await connectDB()
  return (await VisitModel.find({ patientRef: patientId })
    .sort({ visitDate: -1 })
    .lean()) as unknown as VisitRecord[]
}

export async function latestVisitByPatient(
  patientIds: mongoose.Types.ObjectId[]
): Promise<LatestVisit[]> {
  await connectDB()
  return VisitModel.aggregate([
    { $match: { patientRef: { $in: patientIds } } },
    { $sort: { visitDate: -1 } },
    { $group: { _id: "$patientRef", lastVisit: { $first: "$visitDate" }, lastFollowUp: { $first: "$followUpDate" } } },
  ])
}

// ── Mutations ───────────────────────────────────────────────────────────────

export async function createPatient(input: PatientInput): Promise<string> {
  await connectDB()
  const doc = await PatientModel.create({
    ...input,
    consentAt: input.consentGiven ? new Date() : undefined,
  })
  return String(doc._id)
}

export async function updatePatient(id: string, input: PatientInput): Promise<void> {
  await connectDB()
  await PatientModel.findByIdAndUpdate(id, {
    ...input,
    consentAt: input.consentGiven ? new Date() : undefined,
  })
}

export async function softDeletePatient(id: string): Promise<void> {
  await connectDB()
  await PatientModel.findByIdAndUpdate(id, { deletedAt: new Date() })
}

export async function restorePatient(id: string): Promise<void> {
  await connectDB()
  await PatientModel.findByIdAndUpdate(id, { deletedAt: null })
}

export async function setPatientNotes(id: string, notes: string): Promise<void> {
  await connectDB()
  await PatientModel.findByIdAndUpdate(id, { notes })
}

export async function addVisit(patientId: string, input: VisitInput): Promise<void> {
  await connectDB()
  await VisitModel.create({ patientRef: patientId, ...input })
}

export async function updateVisit(visitId: string, input: VisitInput): Promise<void> {
  await connectDB()
  await VisitModel.findByIdAndUpdate(visitId, input)
}

export async function deleteVisit(visitId: string): Promise<void> {
  await connectDB()
  await VisitModel.findByIdAndDelete(visitId)
}
