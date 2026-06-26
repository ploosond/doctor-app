import Link from "next/link"
import { listPatients } from "@/lib/services/patients"
import { listServices } from "@/lib/services/catalog"
import { getAvailableSlotsForDate } from "@/lib/services/booking"
import { createAppointment } from "../actions"

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
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

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
  marginBottom: 16,
}

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; patient?: string }>
}) {
  const { date, patient } = await searchParams

  const [patients, services] = await Promise.all([
    listPatients({}),
    listServices({ visibleOnly: true }),
  ])

  const slots = date ? await getAvailableSlotsForDate(date) : []

  return (
    <div style={{ padding: "36px 40px", maxWidth: 760 }}>
      <div style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/appointments" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / New"}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-heading), serif",
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: "-0.01em",
          color: "var(--color-text)",
          margin: "0 0 28px",
        }}
      >
        New appointment
      </h1>

      {/* Date selector (GET — reloads with ?date=) */}
      <div style={card}>
        <form method="GET" style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          {patient && <input type="hidden" name="patient" value={patient} />}
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input name="date" type="date" defaultValue={date ?? ""} style={inputStyle} />
          </div>
          <button
            type="submit"
            style={{
              padding: "11px 22px",
              borderRadius: 10,
              background: "var(--color-brand)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Load slots
          </button>
        </form>
      </div>

      {!date ? (
        <p style={{ fontSize: 16, color: "var(--color-text-muted)" }}>
          Pick a date and load slots to continue.
        </p>
      ) : slots.length === 0 ? (
        <div style={{ ...card, color: "var(--color-text-muted)", fontSize: 16 }}>
          No available slots for this date. Check{" "}
          <Link href="/admin/availability" style={{ color: "var(--color-brand)", fontWeight: 600 }}>
            availability
          </Link>{" "}
          (working hours / blocked dates) or pick another date.
        </div>
      ) : (
        <form action={createAppointment}>
          {/* Patient + service */}
          <div style={card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Patient</label>
                <select name="patientRef" required defaultValue={patient ?? ""} style={inputStyle}>
                  <option value="" disabled>
                    Select patient…
                  </option>
                  {patients.map((p) => (
                    <option key={String(p._id)} value={String(p._id)}>
                      {p.name} · {p.phone}
                    </option>
                  ))}
                </select>
                <Link
                  href="/admin/patients/new"
                  style={{ fontSize: 14, color: "var(--color-brand)", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 6 }}
                >
                  + New patient
                </Link>
              </div>
              <div>
                <label style={labelStyle}>Service</label>
                <select name="service" required defaultValue="" style={inputStyle}>
                  <option value="" disabled>
                    Select service…
                  </option>
                  {services.map((s) => {
                    const name = (s.content as { en?: { name?: string } })?.en?.name ?? s.slug
                    return (
                      <option key={s.slug} value={s.slug}>
                        {name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Mode + status */}
          <div style={card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Mode</label>
                <select name="mode" defaultValue="in_person" style={inputStyle}>
                  <option value="in_person">In person</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" defaultValue="confirmed" style={inputStyle}>
                  <option value="confirmed">Confirmed</option>
                  <option value="requested">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slot picker */}
          <div style={card}>
            <label style={labelStyle}>Available slots</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
              {slots.map((s) => {
                const value = `${new Date(s.start).toISOString()}|${new Date(s.end).toISOString()}`
                return (
                  <label
                    key={value}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 14px",
                      borderRadius: 8,
                      border: "1.5px solid var(--color-accent)",
                      background: "var(--color-surface)",
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-text)",
                    }}
                  >
                    <input type="radio" name="slot" value={value} required />
                    {formatTime(s.start)}–{formatTime(s.end)}
                  </label>
                )
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
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
              Create appointment
            </button>
            <Link
              href="/admin/appointments"
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: "1.5px solid var(--color-accent)",
                color: "var(--color-text-muted)",
                fontSize: 16,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
