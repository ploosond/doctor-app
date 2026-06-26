import { pathToFileURL } from "url"
import { connect, disconnect } from "./db"
import { AvailabilityModel } from "../../models/availability"

export async function seedAvailability(): Promise<void> {
  // Sun(0)–Fri(5) open 10:00–17:00, Sat(6) closed.
  const workingHours = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    start: "10:00",
    end: "17:00",
    enabled: day !== 6,
  }))

  // One blocked date ~10 days out.
  const blocked = new Date()
  blocked.setDate(blocked.getDate() + 10)
  blocked.setHours(0, 0, 0, 0)

  await AvailabilityModel.findByIdAndUpdate(
    "singleton",
    { workingHours, slotDurationMins: 30, bufferMins: 10, blockedDates: [blocked] },
    { upsert: true, setDefaultsOnInsert: true }
  )
  console.log("✓ availability: singleton upserted (Sun–Fri 10:00–17:00, 30m slots)")
}

// Standalone runner
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  void (async () => {
    await connect()
    await seedAvailability()
    await disconnect()
  })()
}
