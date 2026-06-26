// Internal — do not import directly. Use the public API in ./index.ts.

export type Slot = { start: Date; end: Date }

type WorkingHour = { day: number; start: string; end: string; enabled?: boolean }

type AvailabilityLike = {
  workingHours: WorkingHour[]
  slotDurationMins: number
  bufferMins: number
  blockedDates: (Date | string)[]
}

type BookedLike = { slotStart: Date | string; slotEnd: Date | string }

function parseHM(hm: string): { h: number; m: number } {
  const [h, m] = hm.split(":").map((n) => parseInt(n, 10))
  return { h: h || 0, m: m || 0 }
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Generate bookable slots for a single date.
 *
 * TZ: "HH:MM" working hours are interpreted in the process timezone, which is
 * pinned to Asia/Kathmandu via the `TZ` env var (Nepal has no DST). Keep `TZ`
 * set in every environment so slot times match clinic time.
 */
export function generateSlots(
  dateISO: string,
  availability: AvailabilityLike,
  booked: BookedLike[],
  minStart?: Date
): Slot[] {
  const base = new Date(`${dateISO}T00:00:00`)
  if (isNaN(base.getTime())) return []

  // Skip blocked dates
  const blocked = availability.blockedDates.some((d) => sameCalendarDay(new Date(d), base))
  if (blocked) return []

  const weekday = base.getDay()
  const hours = availability.workingHours.filter((w) => w.day === weekday && w.enabled !== false)
  if (hours.length === 0) return []

  const step = (availability.slotDurationMins || 30) + (availability.bufferMins || 0)
  const durationMs = (availability.slotDurationMins || 30) * 60_000

  const bookedRanges = booked.map((b) => ({
    start: new Date(b.slotStart),
    end: new Date(b.slotEnd),
  }))

  const slots: Slot[] = []
  for (const wh of hours) {
    const s = parseHM(wh.start)
    const e = parseHM(wh.end)
    const dayStart = new Date(base)
    dayStart.setHours(s.h, s.m, 0, 0)
    const dayEnd = new Date(base)
    dayEnd.setHours(e.h, e.m, 0, 0)

    for (let t = dayStart.getTime(); t + durationMs <= dayEnd.getTime() + 1; t += step * 60_000) {
      const start = new Date(t)
      const end = new Date(t + durationMs)
      if (minStart && start <= minStart) continue // drop past times (e.g. earlier today)
      const taken = bookedRanges.some((b) => overlaps(start, end, b.start, b.end))
      if (!taken) slots.push({ start, end })
    }
  }

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime())
}
