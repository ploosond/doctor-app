import { notFound } from "next/navigation"
import Link from "next/link"
import { connectDB } from "@/lib/db"
import { PatientModel } from "@/models/patient"
import { AppointmentModel } from "@/models/appointment"
import { updatePatientNotes } from "../actions"

const STATUS_LABEL: Record<string, string> = {
  requested: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
}

const STATUS_COLOR: Record<string, string> = {
  requested: "#508991",
  confirmed: "#004346",
  completed: "#74B3CE",
  cancelled: "#c0392b",
  no_show: "#c0392b",
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const patient = await PatientModel.findById(id).lean()
  if (!patient) notFound()

  const appointments = await AppointmentModel.find({ patientRef: patient._id })
    .sort({ slotStart: -1 })
    .lean()

  const patientId = String(patient._id)

  return (
    <div style={{ padding: "36px 40px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/patients" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Patients
        </Link>
        {" / "}
        {patient.name}
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
        {patient.name}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
        {/* Demographics */}
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--color-text)",
                margin: "0 0 16px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Profile
            </h2>
            {[
              ["Phone", patient.phone],
              ["Email", patient.email ?? "—"],
              ["Gender", patient.gender ?? "—"],
              ["Consent", patient.consentGiven ? "Given" : "Not given"],
              [
                "Registered",
                new Date(patient.createdAt as Date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid rgba(23,42,58,0.07)",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "var(--color-text)", fontWeight: 600, textTransform: "capitalize" }}>
                  {value as string}
                </span>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--color-text)",
                margin: "0 0 12px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Admin notes
            </h2>
            <form
              action={async (fd: FormData) => {
                "use server"
                await updatePatientNotes(patientId, fd.get("notes") as string)
              }}
            >
              <textarea
                name="notes"
                defaultValue={patient.notes as string | undefined}
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--color-accent)",
                  fontSize: 14,
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
                  padding: "7px 16px",
                  borderRadius: 7,
                  background: "var(--color-surface)",
                  color: "var(--color-brand)",
                  fontSize: 13,
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

        {/* Appointment history */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--color-text)",
              margin: "0 0 16px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Appointment history ({appointments.length})
          </h2>

          {appointments.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>No appointments yet.</p>
          ) : (
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, color: "var(--color-text)" }}
            >
              <thead>
                <tr
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {["Service", "Date", "Status", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={String(appt._id)}
                    style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}
                  >
                    <td style={{ padding: "10px", textTransform: "capitalize" }}>{appt.service}</td>
                    <td style={{ padding: "10px", color: "var(--color-text-muted)" }}>
                      {formatDate(appt.slotStart as Date)}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          background: `${STATUS_COLOR[appt.status as string]}18`,
                          color: STATUS_COLOR[appt.status as string],
                        }}
                      >
                        {STATUS_LABEL[appt.status as string] ?? appt.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <Link
                        href={`/admin/appointments/${String(appt._id)}`}
                        style={{
                          fontSize: 12,
                          color: "var(--color-brand)",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
