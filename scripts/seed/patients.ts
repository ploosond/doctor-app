import { pathToFileURL } from "url"
import { connect, disconnect } from "./db"
import { PatientModel } from "../../models/patient"

function dob(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

const PATIENTS = [
  {
    name: "Aarav Sharma",
    phone: "9800000001",
    email: "aarav.sharma@example.com",
    gender: "male",
    dateOfBirth: dob(1992, 4, 12),
    address: "Lalitpur, Kathmandu",
    occupation: "Software engineer",
    referralSource: "Google search",
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    name: "Priya Gurung",
    phone: "9800000002",
    email: "priya.gurung@example.com",
    gender: "female",
    dateOfBirth: dob(1988, 9, 3),
    address: "Pokhara",
    occupation: "Teacher",
    emergencyContactName: "Bina Gurung",
    emergencyContactPhone: "9811111111",
    alerts: "Allergic to penicillin. History of panic attacks.",
    referralSource: "GP referral",
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    name: "Sita Tamang",
    phone: "9800000003",
    gender: "female",
    dateOfBirth: dob(2001, 1, 25),
    occupation: "Student",
    referralSource: "Instagram",
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    name: "Rohan Thapa",
    phone: "9800000004",
    email: "rohan.thapa@example.com",
    gender: "male",
    dateOfBirth: dob(1979, 11, 8),
    address: "Bhaktapur",
    occupation: "Banker",
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    name: "Maya Shrestha",
    phone: "9800000005",
    email: "maya.shrestha@example.com",
    gender: "female",
    dateOfBirth: dob(1995, 6, 17),
    occupation: "Nurse",
    referralSource: "Word of mouth",
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    name: "Bikash Karki",
    phone: "9800000006",
    gender: "prefer_not_to_say",
    dateOfBirth: dob(1985, 2, 2),
    consentGiven: true,
    consentAt: new Date(),
  },
  {
    // Soft-deleted — drives the "Show deleted" view.
    name: "Deleted Test Patient",
    phone: "9800000099",
    gender: "other",
    consentGiven: true,
    consentAt: new Date(),
    deletedAt: new Date(),
  },
]

export async function seedPatients(): Promise<void> {
  const count = await PatientModel.countDocuments()
  if (count > 0) {
    console.log(`  patients: ${count} already present — skipping`)
    return
  }
  await PatientModel.insertMany(PATIENTS)
  console.log(`✓ patients: seeded ${PATIENTS.length} (1 soft-deleted, 1 with alerts)`)
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    await connect()
    await seedPatients()
    await disconnect()
  })()
}
