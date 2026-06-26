import { connect, disconnect, getMongoClient } from "./db"
import { seedAdmin } from "./admin"
import { seedServices } from "./services"
import { seedAvailability } from "./availability"
import { seedPatients } from "./patients"
import { seedAppointments } from "./appointments"
import { seedVisits } from "./visits"
import { PatientModel } from "../../models/patient"
import { AppointmentModel } from "../../models/appointment"
import { VisitModel } from "../../models/visit"
import { ServiceModel } from "../../models/service"
import { AvailabilityModel } from "../../models/availability"

async function wipeAppData(): Promise<void> {
  // App collections only — NEVER the Better Auth user/session/account collections.
  await Promise.all([
    PatientModel.deleteMany({}),
    AppointmentModel.deleteMany({}),
    VisitModel.deleteMany({}),
    ServiceModel.deleteMany({}),
    AvailabilityModel.deleteMany({}),
  ])
  console.log("✓ --fresh: wiped Patient / Appointment / Visit / Service / Availability (auth kept)")
}

async function main() {
  const fresh = process.argv.includes("--fresh")

  const client = await getMongoClient()
  await connect()
  console.log("Connected. Seeding all features…\n")

  if (fresh) await wipeAppData()

  await seedAdmin(client)
  await seedServices()
  await seedAvailability()
  await seedPatients()
  await seedAppointments()
  await seedVisits()

  await disconnect()
  await client.close()
  console.log("\nDone. Login at /login, then visit /admin/dashboard.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
