"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { adminGetSlots, type AdminSlot } from "../actions"

const ACCENT = "var(--color-brand)"

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function dateParts(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const SLOTS_PREVIEW = 14

export function AppointmentSlotPicker({
  initialDateISO,
  initialSlotValue,
  excludeId,
}: {
  initialDateISO?: string
  initialSlotValue?: string
  excludeId?: string
}) {
  const today = todayISO()
  const [initStartISO] = (initialSlotValue ?? "").split("|")
  const seedDate =
    initialDateISO ?? (initStartISO ? initStartISO.slice(0, 10) : today)

  const [windowStart, setWindowStart] = useState(seedDate < today ? today : seedDate)
  const [date, setDate] = useState(seedDate)
  const [slots, setSlots] = useState<AdminSlot[]>([])
  const [slot, setSlot] = useState<AdminSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  // Initial load (and preselect the current slot when editing). setState happens
  // only after the await, so this doesn't synchronously set state in the effect body.
  useEffect(() => {
    let active = true
    ;(async () => {
      const next = await adminGetSlots(seedDate, excludeId)
      if (!active) return
      setSlots(next)
      if (initialSlotValue) {
        const match = next.find((s) => `${s.startISO}|${s.endISO}` === initialSlotValue)
        if (match) setSlot(match)
      }
      setLoading(false)
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onDateChange(value: string) {
    setDate(value)
    setSlot(null)
    setShowAll(false)
    setLoading(true)
    try {
      setSlots(await adminGetSlots(value, excludeId))
    } finally {
      setLoading(false)
    }
  }

  const stripDays = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(windowStart, i))
  const prevDisabled = windowStart <= today
  const monthYear = dateParts(windowStart).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  const visibleSlots = showAll ? slots : slots.slice(0, SLOTS_PREVIEW)
  const remaining = slots.length - visibleSlots.length
  const dayName = (iso: string) => {
    if (iso === today) return "Today"
    if (iso === addDays(today, 1)) return "Tomorrow"
    return dateParts(iso).toLocaleDateString("en-GB", { weekday: "short" })
  }
  const selectedDateLabel = slot
    ? dateParts(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : ""

  return (
    <div>
      {/* hidden field consumed by createAppointment / updateAppointment */}
      <input
        type="hidden"
        name="slot"
        required
        value={slot ? `${slot.startISO}|${slot.endISO}` : ""}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Select date and time
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>{monthYear}</span>
      </div>

      {/* Day strip */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 4, marginBottom: 18 }}>
        <button
          type="button"
          aria-label="Previous week"
          disabled={prevDisabled}
          onClick={() => setWindowStart(addDays(windowStart, -7))}
          style={{
            background: "none",
            border: "none",
            cursor: prevDisabled ? "not-allowed" : "pointer",
            opacity: prevDisabled ? 0.35 : 1,
            color: "var(--admin-muted)",
            padding: "0 2px",
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="slot-day-strip" style={{ flex: 1 }}>
          {stripDays.map((iso) => {
            const isActive = iso === date
            const isPast = iso < today
            return (
              <button
                key={iso}
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onDateChange(iso)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 2px 10px",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? ACCENT : "transparent"}`,
                  cursor: isPast ? "not-allowed" : "pointer",
                  opacity: isPast ? 0.3 : 1,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? "var(--color-text)" : "var(--admin-muted)" }}>
                  {dayName(iso)}
                </span>
                <span style={{ fontSize: 20, fontWeight: isActive ? 800 : 600, color: isActive ? "var(--color-text)" : "var(--admin-muted)" }}>
                  {dateParts(iso).getDate()}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          aria-label="Next week"
          onClick={() => setWindowStart(addDays(windowStart, 7))}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-muted)", padding: "0 2px" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Time grid */}
      {loading ? (
        <p style={{ color: "var(--admin-muted)", fontSize: 15, margin: 0 }}>Loading slots…</p>
      ) : slots.length === 0 ? (
        <p style={{ color: "var(--admin-muted)", fontSize: 15, margin: 0 }}>
          No available slots for this date. Adjust working hours / blocked dates in Availability, or pick another date.
        </p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 10 }}>
            {visibleSlots.map((s) => {
              const selected = slot?.startISO === s.startISO
              return (
                <button
                  key={s.startISO}
                  type="button"
                  onClick={() => setSlot(s)}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 8,
                    border: `1px solid ${selected ? ACCENT : "var(--admin-border)"}`,
                    background: selected ? ACCENT : "var(--admin-card)",
                    color: selected ? "#fff" : "var(--color-text)",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {s.startLabel}
                </button>
              )
            })}
          </div>
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              style={{
                background: "none",
                border: "none",
                padding: "14px 0 0",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                color: ACCENT,
              }}
            >
              Show more <span style={{ color: "var(--admin-muted)", fontWeight: 500 }}>({remaining} available)</span>
            </button>
          )}
        </>
      )}

      {/* Selected banner */}
      {slot && (
        <div
          style={{
            marginTop: 20,
            padding: "14px 18px",
            borderRadius: 8,
            border: "1px solid var(--admin-border)",
            background: "#FAFBFC",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--admin-muted)", marginBottom: 6 }}>Selected</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={18} color={ACCENT} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>
              {selectedDateLabel}, {slot.startLabel} - {slot.endLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
