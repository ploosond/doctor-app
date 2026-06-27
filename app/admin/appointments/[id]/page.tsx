import { notFound } from "next/navigation"
import Link from "next/link"
import { getAppointment, visitsForAppointment } from "@/lib/services/appointments"
import { updateAppointmentStatus, updateAppointmentNotes, deleteAppointment, overrideAppointmentStatus } from "../actions"
import { addVisit } from "@/app/admin/patients/actions"
import { VisitForm } from "@/app/admin/patients/components/VisitForm"
import { DeleteAppointmentButton } from "../components/DeleteAppointmentButton"
import { FlashBanner } from "@/app/admin/components/FlashBanner"
import { cardStyle, breadcrumbStyle } from "@/app/admin/ui"

function toDateInput(d: Date): string {
  return new Date(d).toISOString().slice(0, 10)
}

function shortDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

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
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  const { id } = await params
  const { flash } = await searchParams

  const appt = await getAppointment(id)
  if (!appt) notFound()

  const patient = appt.patientRef as unknown as {
    _id: string
    name: string
    phone: string
    email?: string
    gender?: string
  }

  const apptId = String(appt._id)
  const patientId = String(patient?._id ?? "")

  const linkedVisits = await visitsForAppointment(apptId)

  return (
    <div className="admin-page">
      <FlashBanner code={flash} />
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <Link href="/admin/appointments" style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / "}
        {patient?.name ?? "Appointment"}
      </div>

      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          Appointment detail
        </h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href={`/admin/appointments/${apptId}/edit`}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
              color: "var(--color-brand)",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Reschedule
          </Link>
          <DeleteAppointmentButton action={deleteAppointment.bind(null, apptId)} />
        </div>
      </div>

      <div className="admin-grid-2" style={{ gap: 24 }}>
        {/* Appointment info */}
        <div
          style={{ ...cardStyle, marginBottom: 0 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--color-text)",
              margin: "0 0 20px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Appointment
          </h2>

          {[
            ["Service", (appt.service as string).charAt(0).toUpperCase() + (appt.service as string).slice(1)],
            ["Mode", (appt.mode as string).replace("_", " ")],
            ["Start", formatDate(appt.slotStart as Date)],
            ["End", formatDate(appt.slotEnd as Date)],
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
              <span style={{ color: "var(--admin-muted)", fontWeight: 500 }}>{label}</span>
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
            {appt.status === "confirmed" && (
              <form
                action={async () => {
                  "use server"
                  await updateAppointmentStatus(apptId, "no_show")
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
                  Mark no-show
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

          {/* Manual status override */}
          <div style={{ marginTop: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--color-text)",
                marginBottom: 8,
                marginTop: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Set status manually
            </h2>
            <form
              action={async (fd: FormData) => {
                "use server"
                await overrideAppointmentStatus(apptId, fd.get("status") as string)
              }}
              style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
            >
              <select
                name="status"
                defaultValue={appt.status as string}
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--admin-border)",
                  fontSize: 15,
                  color: "var(--color-text)",
                  background: "var(--admin-card)",
                  fontFamily: "var(--font-sans), sans-serif",
                }}
              >
                <option value="requested">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-show</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: "var(--color-brand)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Update status
              </button>
            </form>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                color: "var(--admin-muted)",
              }}
            >
              Manual change — no patient notification is sent.
            </p>
          </div>

          {/* Admin notes */}
          <div style={{ marginTop: 24 }}>
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--color-text)",
                marginBottom: 8,
                marginTop: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Admin notes
            </h2>
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
                  border: "1px solid var(--admin-border)",
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
                  background: "#FAFBFC",
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
          style={{ ...cardStyle, marginBottom: 0 }}
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
                fontSize: 13,
                color: "var(--color-text)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
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
                  fontSize: 16,
                }}
              >
                <span style={{ color: "var(--admin-muted)", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{value as string}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--admin-muted)", fontSize: 16 }}>Patient not found.</p>
          )}
        </div>
      </div>

      {/* Clinical note (linked visit) */}
      {patient && (
        <div
          style={{ ...cardStyle, marginTop: 24, marginBottom: 0 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--color-text)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Clinical note ({linkedVisits.length})
            </h2>
            <VisitForm
              action={addVisit.bind(null, patientId)}
              triggerLabel="+ Add visit note"
              hidden={{ appointmentRef: apptId }}
              prefillDate={toDateInput(appt.slotStart as Date)}
            />
          </div>

          {linkedVisits.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 16, margin: 0 }}>
              No visit note recorded for this appointment yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {linkedVisits.map((v) => (
                <div
                  key={String(v._id)}
                  style={{
                    border: "1px solid rgba(23,42,58,0.1)",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text)", marginBottom: 8 }}>
                    {shortDate(v.visitDate as Date)}
                  </div>
                  {v.notes && (
                    <p style={{ fontSize: 16, color: "var(--color-text)", margin: "0 0 10px", whiteSpace: "pre-wrap" }}>
                      {v.notes as string}
                    </p>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 15 }}>
                    {v.diagnosis && (
                      <span style={{ color: "var(--admin-muted)" }}>
                        <strong style={{ color: "var(--color-text)" }}>Dx:</strong> {v.diagnosis as string}
                      </span>
                    )}
                    {v.medication && (
                      <span style={{ color: "var(--admin-muted)" }}>
                        <strong style={{ color: "var(--color-text)" }}>Rx:</strong> {v.medication as string}
                      </span>
                    )}
                    {v.followUpDate && (
                      <span style={{ color: "var(--admin-muted)" }}>
                        <strong style={{ color: "var(--color-text)" }}>Follow-up:</strong> {shortDate(v.followUpDate as Date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <Link
                href={`/admin/patients/${patientId}`}
                style={{ fontSize: 14, color: "var(--color-brand)", fontWeight: 600, textDecoration: "none" }}
              >
                View full patient chart →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
