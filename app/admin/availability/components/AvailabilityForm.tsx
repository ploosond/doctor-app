"use client"

import { useState } from "react"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export type WorkingHour = { day: number; start: string; end: string; enabled?: boolean }

export type AvailabilityData = {
  workingHours: WorkingHour[]
  slotDurationMins: number
  bufferMins: number
  blockedDates: string[] // yyyy-mm-dd
}

const inputStyle = {
  padding: "10px 13px",
  borderRadius: 8,
  border: "1.5px solid var(--color-accent)",
  fontSize: 16,
  color: "var(--color-text)",
  boxSizing: "border-box" as const,
  fontFamily: "var(--font-sans), sans-serif",
  background: "#fff",
}

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  color: "var(--color-text-muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: 6,
}

const sectionHead = {
  fontFamily: "var(--font-sans), sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "var(--color-text)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  margin: "0 0 14px",
  paddingBottom: 8,
  borderBottom: "1px solid rgba(23,42,58,0.08)",
}

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
  marginBottom: 16,
}

export function AvailabilityForm({
  action,
  initialData,
}: {
  action: (fd: FormData) => Promise<void>
  initialData: AvailabilityData
}) {
  const byDay = new Map(initialData.workingHours.map((w) => [w.day, w]))
  const [blocked, setBlocked] = useState<string[]>(
    initialData.blockedDates.length ? initialData.blockedDates : []
  )

  return (
    <form action={action}>
      {/* Working hours */}
      <div style={card}>
        <div style={sectionHead}>Working hours</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DAYS.map((name, day) => {
            const wh = byDay.get(day)
            return (
              <div
                key={day}
                style={{ display: "grid", gridTemplateColumns: "150px auto auto", gap: 14, alignItems: "center" }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, fontWeight: 600, color: "var(--color-text)" }}>
                  <input
                    name={`enabled_${day}`}
                    type="checkbox"
                    defaultChecked={wh ? wh.enabled !== false : false}
                    style={{ width: 15, height: 15 }}
                  />
                  {name}
                </label>
                <input name={`start_${day}`} type="time" defaultValue={wh?.start ?? "10:00"} style={inputStyle} />
                <input name={`end_${day}`} type="time" defaultValue={wh?.end ?? "17:00"} style={inputStyle} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Slot settings */}
      <div style={card}>
        <div style={sectionHead}>Slot settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Slot duration (mins)</label>
            <input name="slotDurationMins" type="number" min={5} step={5} defaultValue={initialData.slotDurationMins} style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <label style={labelStyle}>Buffer between slots (mins)</label>
            <input name="bufferMins" type="number" min={0} step={5} defaultValue={initialData.bufferMins} style={{ ...inputStyle, width: "100%" }} />
          </div>
        </div>
      </div>

      {/* Blocked dates */}
      <div style={card}>
        <div style={sectionHead}>Blocked dates (holidays / leave)</div>
        {blocked.length === 0 && (
          <p style={{ fontSize: 15, color: "var(--color-text-muted)", margin: "0 0 12px" }}>No blocked dates.</p>
        )}
        {blocked.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input
              name="blockedDate"
              type="date"
              defaultValue={d}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setBlocked(blocked.filter((_, j) => j !== i))}
              style={{
                padding: "0 12px",
                height: 40,
                borderRadius: 7,
                border: "1.5px solid rgba(192,57,43,0.3)",
                background: "rgba(192,57,43,0.06)",
                color: "#c0392b",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setBlocked([...blocked, ""])}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "1.5px solid var(--color-accent)",
            background: "var(--color-surface)",
            color: "var(--color-brand)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add blocked date
        </button>
      </div>

      <button
        type="submit"
        style={{
          padding: "12px 28px",
          borderRadius: 10,
          background: "var(--color-brand)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
        }}
      >
        Save availability
      </button>
    </form>
  )
}
