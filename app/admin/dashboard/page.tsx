import { appointmentStats, recentAppointments as getRecentAppointments } from "@/lib/services/appointments"
import { countActivePatients } from "@/lib/services/patients"
import Link from "next/link"

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

export default async function DashboardPage() {
  const [counts, totalPatients, recentAppointments] = await Promise.all([
    appointmentStats(),
    countActivePatients(),
    getRecentAppointments(5),
  ])

  const stats = [
    { label: "Today's appointments", value: counts.today },
    { label: "Pending confirmation", value: counts.pending },
    { label: "Total patients", value: totalPatients },
    { label: "This week", value: counts.week },
  ]

  return (
    <div className="admin-page">
      <h1 className="admin-h1">Dashboard</h1>

      {/* Stat cards */}
      <div className="admin-grid-stats" style={{ marginBottom: 40 }}>
        {stats.map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              padding: "22px 24px",
              boxShadow: "var(--admin-shadow)",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--color-brand)",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 14, color: "var(--admin-muted)", fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div>
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
              fontSize: 18,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Recent appointments
          </h2>
          <Link
            href="/admin/appointments"
            style={{
              fontSize: 15,
              color: "var(--color-brand)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            View all →
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--admin-muted)",
              fontSize: 15,
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
            }}
          >
            No appointments yet.
          </div>
        ) : (
          <div
            style={{
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              boxShadow: "var(--admin-shadow)",
              overflow: "hidden",
            }}
          >
            <table
              className="admin-table"
              style={{
                fontSize: 15,
                color: "var(--color-text)",
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
                  {["Patient", "Service", "Date", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appt) => {
                  const patient = appt.patientRef as unknown as { name: string }
                  return (
                    <tr key={String(appt._id)} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                      <td data-label="Patient" style={{ padding: "14px 16px" }}>{patient?.name ?? "—"}</td>
                      <td data-label="Service" style={{ padding: "14px 16px", textTransform: "capitalize" }}>{appt.service}</td>
                      <td data-label="Date" style={{ padding: "14px 16px", color: "var(--admin-muted)" }}>
                        {formatDate(appt.slotStart as Date)}
                      </td>
                      <td data-label="Status" style={{ padding: "14px 16px" }}>
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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
