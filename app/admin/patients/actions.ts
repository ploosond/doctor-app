"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { PatientModel } from "@/models/patient"

export async function updatePatientNotes(id: string, notes: string) {
  await connectDB()
  await PatientModel.findByIdAndUpdate(id, { notes })
  revalidatePath(`/admin/patients/${id}`)
}
