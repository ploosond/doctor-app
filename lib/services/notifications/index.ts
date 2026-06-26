// PUBLIC API — the only import surface for the notifications module.
// Email-only (Resend). All functions are fail-soft: they never throw, so a
// notification failure cannot break a booking or a status change.

import { connectDB } from "@/lib/db"
import { env } from "@/lib/env"
import { AppointmentModel } from "@/models/appointment"
import { sendEmail } from "./email"
import {
  msgNewRequestPatient,
  msgConfirmed,
  msgCancelled,
  emailNewRequestClinic,
  emailPatient,
  emailResetPassword,
  emailVerify,
} from "./templates"

// Re-export so auth callbacks (and any server code) can send mail through the
// notifications public API instead of importing the internal module.
export { sendEmail }
export { emailResetPassword, emailVerify }

type PopulatedPatient = { name?: string; phone?: string; email?: string }

async function loadAppointment(appointmentId: string) {
  await connectDB()
  const appt = await AppointmentModel.findById(appointmentId)
    .populate("patientRef", "name phone email")
    .lean()
  if (!appt) return null
  const patient = (appt.patientRef as unknown as PopulatedPatient) ?? {}
  return { appt, patient }
}

export async function notifyNewRequest(appointmentId: string): Promise<void> {
  try {
    const data = await loadAppointment(appointmentId)
    if (!data) return
    const { appt, patient } = data

    const clinicInbox = env.CLINIC_NOTIFY_EMAIL
    if (clinicInbox && patient.name) {
      const mail = emailNewRequestClinic({
        name: patient.name,
        phone: patient.phone ?? "—",
        service: appt.service as string,
        slotStart: appt.slotStart as Date,
        reason: appt.notes as string | undefined,
      })
      await sendEmail({ to: clinicInbox, ...mail })
    }

    if (patient.email) {
      await sendEmail({
        to: patient.email,
        ...emailPatient("Appointment request received", msgNewRequestPatient()),
      })
    }
  } catch (err) {
    console.error("[notifications] notifyNewRequest failed:", err)
  }
}

export async function notifyConfirmed(appointmentId: string): Promise<void> {
  try {
    const data = await loadAppointment(appointmentId)
    if (!data) return
    const { appt, patient } = data
    if (patient.email) {
      await sendEmail({
        to: patient.email,
        ...emailPatient("Appointment confirmed", msgConfirmed(appt.slotStart as Date)),
      })
    }
  } catch (err) {
    console.error("[notifications] notifyConfirmed failed:", err)
  }
}

export async function notifyCancelled(appointmentId: string): Promise<void> {
  try {
    const data = await loadAppointment(appointmentId)
    if (!data) return
    const { appt, patient } = data
    if (patient.email) {
      await sendEmail({
        to: patient.email,
        ...emailPatient("Appointment cancelled", msgCancelled(appt.slotStart as Date)),
      })
    }
  } catch (err) {
    console.error("[notifications] notifyCancelled failed:", err)
  }
}
