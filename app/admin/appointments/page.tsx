import { connectDB } from "@/lib/db"
import { AppointmentModel } from "@/models/appointment"
import Link from "next/link"
import { updateAppointmentStatus } from "./actions"

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
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  await connectDB()

  const filter: Record<string, unknown> = {}
  if (status) filter.status = status

  const appointments = await AppointmentModel.find(filter)
    .sort({ slotStart: -1 })
    .populate("patientRef", "name phone")
    .lean()

  return (
    <div style={{ padding: "36px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Appointments
        </h1>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          ["", "All"],
          ["requested", "Pending"],
          ["confirmed", "Confirmed"],
          ["completed", "Completed"],
          ["cancelled", "Cancelled"],
        ].map(([val, label]) => (
          <Link
            key={val}
            href={val ? `/admin/appointments?status=${val}` : "/admin/appointments"}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              border: "1.5px solid",
              borderColor: status === val || (!val && !status) ? "var(--color-brand)" : "var(--color-accent)",
              background: status === val || (!val && !status) ? "var(--color-brand)" : "transparent",
              color: status === val || (!val && !status) ? "#fff" : "var(--color-text-muted)",
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
            color: "var(--color-text-muted)",
            fontSize: 14,
            background: "var(--color-surface)",
            borderRadius: 12,
          }}
        >
          No appointments found.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
            color: "var(--color-text)",
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-muted)",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {["Patient", "Service", "Mode", "Date / Time", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600 }}>
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
                <tr key={apptId} style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600 }}>{patient?.name ?? "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{patient?.phone}</div>
                  </td>
                  <td style={{ padding: "12px 16px", textTransform: "capitalize" }}>{appt.service}</td>
                  <td style={{ padding: "12px 16px", textTransform: "capitalize" }}>
                    {(appt.mode as string).replace("_", " ")}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>
                    {formatDate(appt.slotStart as Date)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: `${STATUS_COLOR[appt.status as string]}18`,
                        color: STATUS_COLOR[appt.status as string],
                      }}
                    >
                      {STATUS_LABEL[appt.status as string] ?? appt.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                              padding: "5px 12px",
                              borderRadius: 7,
                              background: "var(--color-brand)",
                              color: "#fff",
                              fontSize: 12,
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
                              padding: "5px 12px",
                              borderRadius: 7,
                              background: "rgba(192,57,43,0.1)",
                              color: "#c0392b",
                              fontSize: 12,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                      <Link
                        href={`/admin/appointments/${apptId}`}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 7,
                          background: "var(--color-surface)",
                          color: "var(--color-text-muted)",
                          fontSize: 12,
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
