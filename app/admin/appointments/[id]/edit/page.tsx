import Link from "next/link"
import { notFound } from "next/navigation"
import { getAppointment } from "@/lib/services/appointments"
import { listServices } from "@/lib/services/catalog"
import { getAvailableSlotsForDate } from "@/lib/services/booking"
import { updateAppointment } from "../../actions"

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function toDateInput(d: Date): string {
  return new Date(d).toISOString().slice(0, 10)
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

export default async function EditAppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { id } = await params
  const { date: dateParam } = await searchParams

  const appt = await getAppointment(id)
  if (!appt) notFound()

  const patient = appt.patientRef as unknown as { name: string; phone: string }
  const date = dateParam ?? toDateInput(appt.slotStart as Date)

  const [services, slots] = await Promise.all([
    listServices({ visibleOnly: true }),
    getAvailableSlotsForDate(date, id),
  ])

  const currentSlotValue = `${new Date(appt.slotStart as Date).toISOString()}|${new Date(appt.slotEnd as Date).toISOString()}`

  return (
    <div style={{ padding: "36px 40px", maxWidth: 760 }}>
      <div style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/appointments" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / "}
        <Link href={`/admin/appointments/${id}`} style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          {patient?.name ?? "Appointment"}
        </Link>
        {" / Reschedule"}
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
        Reschedule appointment
      </h1>

      {/* Patient (read-only) */}
      <div style={card}>
        <label style={labelStyle}>Patient</label>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text)" }}>
          {patient?.name} · {patient?.phone}
        </div>
      </div>

      {/* Date selector (GET — reloads with ?date=) */}
      <div style={card}>
        <form method="GET" style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input name="date" type="date" defaultValue={date} style={inputStyle} />
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

      {slots.length === 0 ? (
        <div style={{ ...card, color: "var(--color-text-muted)", fontSize: 16 }}>
          No available slots for this date. Check{" "}
          <Link href="/admin/availability" style={{ color: "var(--color-brand)", fontWeight: 600 }}>
            availability
          </Link>{" "}
          or pick another date.
        </div>
      ) : (
        <form action={updateAppointment.bind(null, id)}>
          {/* Service + mode */}
          <div style={card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Service</label>
                <select name="service" required defaultValue={appt.service as string} style={inputStyle}>
                  {services.map((s) => {
                    const name = (s.content as { en?: { name?: string } })?.en?.name ?? s.slug
                    return (
                      <option key={s.slug} value={s.slug}>
                        {name}
                      </option>
                    )
                  })}
                  {/* keep current service selectable even if now hidden */}
                  {!services.some((s) => s.slug === appt.service) && (
                    <option value={appt.service as string}>{appt.service as string}</option>
                  )}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mode</label>
                <select name="mode" defaultValue={appt.mode as string} style={inputStyle}>
                  <option value="in_person">In person</option>
                  <option value="video">Video</option>
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
                    <input type="radio" name="slot" value={value} required defaultChecked={value === currentSlotValue} />
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
              Save changes
            </button>
            <Link
              href={`/admin/appointments/${id}`}
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
