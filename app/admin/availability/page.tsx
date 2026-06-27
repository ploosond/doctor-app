import { getAvailability } from "@/lib/services/availability"
import { AvailabilityForm, type AvailabilityData } from "./components/AvailabilityForm"
import { updateAvailability } from "./actions"
import { FlashBanner } from "../components/FlashBanner"

function toDateInput(d: Date | string): string {
  return new Date(d).toISOString().slice(0, 10)
}

type WH = { day: number; start: string; end: string; enabled?: boolean }

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  const { flash } = await searchParams
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
    <div className="admin-page">
      <FlashBanner code={flash} />
      <h1 className="admin-h1" style={{ margin: "0 0 8px" }}>
        Availability
      </h1>
      <p style={{ fontSize: 15, color: "var(--admin-muted)", margin: "0 0 28px" }}>
        Set the weekly working hours and slot rules used to generate bookable appointment slots.
      </p>
      <AvailabilityForm action={updateAvailability} initialData={initialData} />
    </div>
  )
}
