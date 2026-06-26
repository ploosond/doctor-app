"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as patients from "@/lib/services/patients"
import type { Gender, PatientInput, VisitInput } from "@/lib/services/patients"

function str(fd: FormData, key: string): string | undefined {
  const v = (fd.get(key) as string | null)?.trim()
  return v ? v : undefined
}

function date(fd: FormData, key: string): Date | undefined {
  const v = (fd.get(key) as string | null)?.trim()
  return v ? new Date(v) : undefined
}

function patientFields(fd: FormData): PatientInput {
  return {
    name: str(fd, "name") ?? "",
    phone: str(fd, "phone") ?? "",
    email: str(fd, "email"),
    dateOfBirth: date(fd, "dateOfBirth"),
    gender: str(fd, "gender") as Gender | undefined,
    address: str(fd, "address"),
    occupation: str(fd, "occupation"),
    emergencyContactName: str(fd, "emergencyContactName"),
    emergencyContactPhone: str(fd, "emergencyContactPhone"),
    referralSource: str(fd, "referralSource"),
    alerts: str(fd, "alerts"),
    consentGiven: fd.get("consentGiven") === "on",
  }
}

function visitFields(fd: FormData): VisitInput {
  return {
    visitDate: date(fd, "visitDate") ?? new Date(),
    notes: str(fd, "notes"),
    diagnosis: str(fd, "diagnosis"),
    medication: str(fd, "medication"),
    followUpDate: date(fd, "followUpDate"),
    appointmentRef: str(fd, "appointmentRef"),
  }
}

export async function createPatient(fd: FormData) {
  const id = await patients.createPatient(patientFields(fd))
  revalidatePath("/admin/patients")
  redirect(`/admin/patients/${id}`)
}

export async function updatePatient(id: string, fd: FormData) {
  await patients.updatePatient(id, patientFields(fd))
  revalidatePath("/admin/patients")
  revalidatePath(`/admin/patients/${id}`)
  redirect(`/admin/patients/${id}`)
}

export async function deletePatient(id: string) {
  await patients.softDeletePatient(id)
  revalidatePath("/admin/patients")
  redirect("/admin/patients")
}

export async function restorePatient(id: string) {
  await patients.restorePatient(id)
  revalidatePath("/admin/patients")
}

export async function updatePatientNotes(id: string, notes: string) {
  await patients.setPatientNotes(id, notes)
  revalidatePath(`/admin/patients/${id}`)
}

export async function addVisit(patientId: string, fd: FormData) {
  const fields = visitFields(fd)
  await patients.addVisit(patientId, fields)
  revalidatePath(`/admin/patients/${patientId}`)
  if (fields.appointmentRef) revalidatePath(`/admin/appointments/${fields.appointmentRef}`)
}

export async function updateVisit(visitId: string, patientId: string, fd: FormData) {
  await patients.updateVisit(visitId, visitFields(fd))
  revalidatePath(`/admin/patients/${patientId}`)
}

export async function deleteVisit(visitId: string, patientId: string) {
  await patients.deleteVisit(visitId)
  revalidatePath(`/admin/patients/${patientId}`)
}
