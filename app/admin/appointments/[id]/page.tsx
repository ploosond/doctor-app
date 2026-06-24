import { notFound } from "next/navigation"
import Link from "next/link"
import { connectDB } from "@/lib/db"
import { AppointmentModel } from "@/models/appointment"
import { updateAppointmentStatus, updateAppointmentNotes } from "../actions"

const STATUS_LABEL: Record<string, string> = {
  requested: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const appt = await AppointmentModel.findById(id)
    .populate("patientRef", "name phone email gender dateOfBirth")
    .lean()

  if (!appt) notFound()

  const patient = appt.patientRef as unknown as {
    _id: string
    name: string
    phone: string
    email?: string
    gender?: string
  }

  const apptId = String(appt._id)

  return (
    <div style={{ padding: "36px 40px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/appointments" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / "}
        {patient?.name ?? "Appointment"}
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
        Appointment detail
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Appointment info */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "28px",
            boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: "var(--color-text)",
              margin: "0 0 20px",
            }}
          >
            Appointment
          </h2>

          {[
            ["Service", (appt.service as string).charAt(0).toUpperCase() + (appt.service as string).slice(1)],
            ["Mode", (appt.mode as string).replace("_", " ")],
            ["Start", formatDate(appt.slotStart as Date)],
            ["End", formatDate(appt.slotEnd as Date)],
            ["Fee", appt.fee ? `Rs. ${appt.fee}` : "—"],
            ["Payment", appt.paymentStatus as string],
            ["Status", STATUS_LABEL[appt.status as string] ?? appt.status],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(23,42,58,0.07)",
                fontSize: 16,
              }}
            >
              <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
              <span style={{ color: "var(--color-text)", fontWeight: 600, textAlign: "right", textTransform: "capitalize" }}>
                {value as string}
              </span>
            </div>
          ))}

          {/* Status actions */}
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {appt.status === "requested" && (
              <form
                action={async () => {
                  "use server"
                  await updateAppointmentStatus(apptId, "confirmed")
                }}
              >
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "var(--color-brand)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              </form>
            )}
            {appt.status === "confirmed" && (
              <form
                action={async () => {
                  "use server"
                  await updateAppointmentStatus(apptId, "completed")
                }}
              >
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "var(--color-brand)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Mark completed
                </button>
              </form>
            )}
            {(appt.status === "requested" || appt.status === "confirmed") && (
              <form
                action={async () => {
                  "use server"
                  await updateAppointmentStatus(apptId, "cancelled")
                }}
              >
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "rgba(192,57,43,0.1)",
                    color: "#c0392b",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Admin notes */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-muted)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Admin notes
            </div>
            <form
              action={async (fd: FormData) => {
                "use server"
                await updateAppointmentNotes(apptId, fd.get("notes") as string)
              }}
            >
              <textarea
                name="notes"
                defaultValue={appt.notes as string | undefined}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid var(--color-accent)",
                  fontSize: 16,
                  color: "var(--color-text)",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-sans), sans-serif",
                }}
              />
              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: "9px 18px",
                  borderRadius: 7,
                  background: "var(--color-surface)",
                  color: "var(--color-brand)",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "1.5px solid var(--color-brand)",
                  cursor: "pointer",
                }}
              >
                Save notes
              </button>
            </form>
          </div>
        </div>

        {/* Patient info */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "28px",
            boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--color-text)",
                margin: 0,
              }}
            >
              Patient
            </h2>
            <Link
              href={`/admin/patients/${patient?._id}`}
              style={{
                fontSize: 15,
                color: "var(--color-brand)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Full profile →
            </Link>
          </div>

          {patient ? (
            [
              ["Name", patient.name],
              ["Phone", patient.phone],
              ["Email", patient.email ?? "—"],
              ["Gender", patient.gender ?? "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(23,42,58,0.07)",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{value as string}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: 16 }}>Patient not found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
