import { getAvailability } from "@/lib/services/availability"
import { AvailabilityForm, type AvailabilityData } from "./components/AvailabilityForm"
import { updateAvailability } from "./actions"

function toDateInput(d: Date | string): string {
  return new Date(d).toISOString().slice(0, 10)
}

type WH = { day: number; start: string; end: string; enabled?: boolean }

export default async function AvailabilityPage() {
  const doc = await getAvailability()

  const initialData: AvailabilityData = {
    workingHours: (((doc?.workingHours ?? []) as unknown as WH[])).map((w) => ({
      day: w.day,
      start: w.start,
      end: w.end,
      enabled: w.enabled,
    })),
    slotDurationMins: (doc?.slotDurationMins as number) ?? 30,
    bufferMins: (doc?.bufferMins as number) ?? 10,
    blockedDates: ((doc?.blockedDates ?? []) as unknown as Date[]).map(toDateInput),
  }

  return (
    <div style={{ padding: "36px 40px", maxWidth: 720 }}>
      <h1
        style={{
          fontFamily: "var(--font-heading), serif",
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: "-0.01em",
          color: "var(--color-text)",
          margin: "0 0 8px",
        }}
      >
        Availability
      </h1>
      <p style={{ fontSize: 15, color: "var(--color-text-muted)", margin: "0 0 28px" }}>
        Set the weekly working hours and slot rules used to generate bookable appointment slots.
      </p>
      <AvailabilityForm action={updateAvailability} initialData={initialData} />
    </div>
  )
}
