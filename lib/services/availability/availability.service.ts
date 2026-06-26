// Internal — do not import directly. Use the public API in ./index.ts.

import { connectDB } from "@/lib/db"
import { AvailabilityModel } from "@/models/availability"

export type WorkingHour = { day: number; start: string; end: string; enabled: boolean }

export type AvailabilityInput = {
  workingHours: WorkingHour[]
  slotDurationMins: number
  bufferMins: number
  blockedDates: Date[]
}

export type AvailabilityRecord = Record<string, unknown>

export async function getAvailability(): Promise<AvailabilityRecord | null> {
  await connectDB()
  return (await AvailabilityModel.findById("singleton").lean()) as unknown as AvailabilityRecord | null
}

export async function saveAvailability(input: AvailabilityInput): Promise<void> {
  await connectDB()
  await AvailabilityModel.findByIdAndUpdate(
    "singleton",
    {
      workingHours: input.workingHours,
      slotDurationMins: input.slotDurationMins,
      bufferMins: input.bufferMins,
      blockedDates: input.blockedDates,
    },
    { upsert: true, setDefaultsOnInsert: true }
  )
}
