import { pathToFileURL } from "url"
import { connect, disconnect } from "./db"
import { AppointmentModel } from "../../models/appointment"
import { VisitModel } from "../../models/visit"

function daysFromNow(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function seedVisits(): Promise<void> {
  const existing = await VisitModel.countDocuments()
  if (existing > 0) {
    console.log(`  visits: ${existing} already present — skipping`)
    return
  }

  const completed = await AppointmentModel.find({ status: "completed" })
    .select("_id patientRef slotStart")
    .sort({ slotStart: -1 })
    .lean()

  if (completed.length === 0) {
    console.log("  visits: needs completed appointments first — run that seeder. Skipping.")
    return
  }

  // One clinical note per completed appointment. The most recent visit carries a
  // past follow-up date so the "Follow-ups due" banner on /admin/patients lights up.
  const docs = completed.map((appt, i) => ({
    patientRef: appt.patientRef,
    appointmentRef: appt._id,
    visitDate: appt.slotStart as Date,
    notes:
      i === 0
        ? "Reviewed presenting concerns; mood improving. Sleep still disrupted."
        : "Initial assessment completed. Agreed on a treatment plan.",
    diagnosis: i === 0 ? "Generalised anxiety disorder" : "Mild depressive episode",
    medication: i === 0 ? "Sertraline 50mg OD" : "—",
    followUpDate: i === 0 ? daysFromNow(-1) : daysFromNow(14), // past = due, future = upcoming
  }))

  await VisitModel.insertMany(docs)
  console.log(`✓ visits: seeded ${docs.length} (1 follow-up overdue, 1 upcoming)`)
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    await connect()
    await seedVisits()
    await disconnect()
  })()
}
