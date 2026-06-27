import { listAppointments } from "@/lib/services/appointments"
import Link from "next/link"
import { updateAppointmentStatus } from "./actions"
import { FlashBanner } from "../components/FlashBanner"

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

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; flash?: string }>
}) {
  const { status, flash } = await searchParams
  const appointments = await listAppointments({ status })

  return (
    <div className="admin-page">
      <FlashBanner code={flash} />
      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          Appointments
        </h1>
        <Link
          href="/admin/appointments/new"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + New appointment
        </Link>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          ["", "All"],
          ["requested", "Pending"],
          ["confirmed", "Confirmed"],
          ["completed", "Completed"],
          ["cancelled", "Cancelled"],
          ["no_show", "No-show"],
        ].map(([val, label]) => (
          <Link
            key={val}
            href={val ? `/admin/appointments?status=${val}` : "/admin/appointments"}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid",
              borderColor: status === val || (!val && !status) ? "var(--color-brand)" : "var(--admin-border)",
              background: status === val || (!val && !status) ? "var(--color-brand)" : "var(--admin-card)",
              color: status === val || (!val && !status) ? "#fff" : "var(--admin-muted)",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "var(--admin-muted)",
            fontSize: 15,
            background: "var(--admin-card)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
          }}
        >
          No appointments found.
        </div>
      ) : (
        <table
          className="admin-table"
          style={{
            fontSize: 15,
            color: "var(--color-text)",
            background: "var(--admin-card)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "var(--admin-shadow)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#FAFBFC",
                borderBottom: "1px solid var(--admin-border)",
                color: "var(--admin-muted)",
                fontSize: 12.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {["Patient", "Service", "Mode", "Date / Time", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const patient = appt.patientRef as unknown as { _id: string; name: string; phone: string }
              const apptId = String(appt._id)
              return (
                <tr key={apptId} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td data-label="Patient" style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 600 }}>{patient?.name ?? "—"}</div>
                    <div style={{ fontSize: 13, color: "var(--admin-muted)" }}>{patient?.phone}</div>
                  </td>
                  <td data-label="Service" style={{ padding: "14px 18px", textTransform: "capitalize" }}>{appt.service}</td>
                  <td data-label="Mode" style={{ padding: "14px 18px", textTransform: "capitalize" }}>
                    {(appt.mode as string).replace("_", " ")}
                  </td>
                  <td data-label="Date / Time" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                    {formatDate(appt.slotStart as Date)}
                  </td>
                  <td data-label="Status" style={{ padding: "14px 18px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        background: `${STATUS_COLOR[appt.status as string]}18`,
                        color: STATUS_COLOR[appt.status as string],
                      }}
                    >
                      {STATUS_LABEL[appt.status as string] ?? appt.status}
                    </span>
                  </td>
                  <td data-label="" style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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
                              padding: "7px 14px",
                              borderRadius: 7,
                              background: "var(--color-brand)",
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Confirm
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
                              padding: "7px 14px",
                              borderRadius: 7,
                              background: "rgba(192,57,43,0.1)",
                              color: "#c0392b",
                              fontSize: 14,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
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
                              padding: "7px 14px",
                              borderRadius: 7,
                              background: "rgba(192,57,43,0.1)",
                              color: "#c0392b",
                              fontSize: 14,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            No-show
                          </button>
                        </form>
                      )}
                      <Link
                        href={`/admin/appointments/${apptId}`}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          background: "var(--admin-card)",
                          border: "1px solid var(--admin-border)",
                          color: "var(--color-text)",
                          fontSize: 14,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
