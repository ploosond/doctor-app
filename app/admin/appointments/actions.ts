"use server"

import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { AppointmentModel } from "@/models/appointment"

export async function updateAppointmentStatus(id: string, status: string) {
  await connectDB()
  await AppointmentModel.findByIdAndUpdate(id, { status })
  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  revalidatePath("/admin/dashboard")
}

export async function updateAppointmentNotes(id: string, notes: string) {
  await connectDB()
  await AppointmentModel.findByIdAndUpdate(id, { notes })
  revalidatePath(`/admin/appointments/${id}`)
}
