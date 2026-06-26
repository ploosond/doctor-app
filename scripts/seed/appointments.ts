import { pathToFileURL } from "url"
import { connect, disconnect } from "./db"
import { PatientModel } from "../../models/patient"
import { ServiceModel } from "../../models/service"
import { AppointmentModel } from "../../models/appointment"

/** A 30-min slot at (today + dayOffset) hh:mm — internally non-overlapping per the table below. */
function slot(dayOffset: number, hour: number, minute: number): { slotStart: Date; slotEnd: Date } {
  const slotStart = new Date()
  slotStart.setDate(slotStart.getDate() + dayOffset)
  slotStart.setHours(hour, minute, 0, 0)
  const slotEnd = new Date(slotStart)
  slotEnd.setMinutes(slotEnd.getMinutes() + 30)
  return { slotStart, slotEnd }
}

// dayOffset, hour, minute, status, mode — spans all 5 statuses + today/this-week/past/future.
const PLAN: [number, number, number, string, "in_person" | "video"][] = [
  [0, 10, 0, "confirmed", "in_person"], // today
  [0, 14, 0, "requested", "video"], // today, pending
  [1, 11, 0, "confirmed", "in_person"],
  [2, 15, 0, "requested", "in_person"],
  [3, 10, 30, "confirmed", "video"],
  [-2, 11, 0, "completed", "in_person"], // past — gets a visit
  [-5, 14, 0, "completed", "in_person"], // past — gets a visit
  [-1, 16, 0, "no_show", "in_person"],
  [-3, 10, 0, "cancelled", "video"],
  [8, 13, 0, "requested", "in_person"], // future
  [9, 15, 30, "confirmed", "in_person"], // future
]

export async function seedAppointments(): Promise<void> {
  const existing = await AppointmentModel.countDocuments()
  if (existing > 0) {
    console.log(`  appointments: ${existing} already present — skipping`)
    return
  }

  const patients = await PatientModel.find({ deletedAt: null }).select("_id").lean()
  const slugs = (await ServiceModel.find().select("slug").lean()).map((s) => s.slug as string)
  if (patients.length === 0 || slugs.length === 0) {
    console.log("  appointments: needs patients + services first — run those seeders. Skipping.")
    return
  }

  const docs = PLAN.map(([dayOffset, hour, minute, status, mode], i) => ({
    patientRef: patients[i % patients.length]._id,
    service: slugs[i % slugs.length],
    mode,
    status,
    notes: status === "requested" ? "Booking reason: initial enquiry" : undefined,
    ...slot(dayOffset, hour, minute),
  }))

  await AppointmentModel.insertMany(docs)
  console.log(`✓ appointments: seeded ${docs.length} across all statuses`)
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    await connect()
    await seedAppointments()
    await disconnect()
  })()
}
