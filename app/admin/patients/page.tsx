import { listPatients, latestVisitByPatient } from "@/lib/services/patients"
import { restorePatient } from "./actions"
import Link from "next/link"
import { FlashBanner } from "../components/FlashBanner"

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; deleted?: string; flash?: string }>
}) {
  const { q, deleted, flash } = await searchParams
  const showDeleted = deleted === "1"

  const patients = await listPatients({ q, deleted: showDeleted })

  // Latest visit per patient (last visit date + that visit's follow-up date)
  const patientIds = patients.map((p) => p._id)
  const latest = await latestVisitByPatient(patientIds)
  const lastVisitMap = Object.fromEntries(latest.map((v) => [String(v._id), v.lastVisit as Date]))
  const followUpMap = Object.fromEntries(
    latest.filter((v) => v.lastFollowUp).map((v) => [String(v._id), v.lastFollowUp as Date])
  )

  const now = new Date()
  const nameMap = Object.fromEntries(patients.map((p) => [String(p._id), p.name]))
  const dueList = Object.entries(followUpMap)
    .filter(([, due]) => new Date(due) <= now)
    .sort(([, a], [, b]) => new Date(a).getTime() - new Date(b).getTime())

  return (
    <div className="admin-page">
      <FlashBanner code={flash} />
      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          {showDeleted ? "Deleted patients" : "Patients"}
        </h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href={showDeleted ? "/admin/patients" : "/admin/patients?deleted=1"}
            style={{
              fontSize: 14,
              color: "var(--admin-muted)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {showDeleted ? "← Active patients" : "Show deleted"}
          </Link>
          {!showDeleted && (
            <Link
              href="/admin/patients/new"
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
              + New patient
            </Link>
          )}
        </div>
      </div>

      {/* Follow-up due */}
      {!showDeleted && dueList.length > 0 && (
        <div
          style={{
            background: "rgba(192,57,43,0.06)",
            border: "1.5px solid rgba(192,57,43,0.25)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#c0392b",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 10,
            }}
          >
            Follow-ups due ({dueList.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {dueList.map(([pid, due]) => (
              <Link
                key={pid}
                href={`/admin/patients/${pid}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontSize: 15,
                  color: "var(--color-text)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontWeight: 600 }}>{nameMap[pid]}</span>
                <span style={{ color: "#c0392b", fontWeight: 600 }}>due {formatDate(due)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <form method="GET" style={{ marginBottom: 24 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone or email…"
          style={{
            padding: "11px 16px",
            borderRadius: 8,
            border: "1px solid var(--admin-border)",
            background: "var(--admin-card)",
            fontSize: 15,
            color: "var(--color-text)",
            width: "100%",
            maxWidth: 320,
            boxSizing: "border-box",
            outline: "none",
          }}
        />
      </form>

      {patients.length === 0 ? (
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
          {q ? `No patients matching "${q}".` : "No patients yet."}
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
              {["Name", "Phone", "Email", "Last visit", "Registered", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const pid = String(patient._id)
              const lastVisit = lastVisitMap[pid]
              return (
                <tr key={pid} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td data-label="Name" style={{ padding: "14px 18px", fontWeight: 600 }}>
                    {patient.alerts && (
                      <span title="Has alerts" style={{ color: "#c0392b", marginRight: 6 }}>
                        ⚠
                      </span>
                    )}
                    {patient.name}
                  </td>
                  <td data-label="Phone" style={{ padding: "14px 18px" }}>{patient.phone}</td>
                  <td data-label="Email" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                    {patient.email ?? "—"}
                  </td>
                  <td data-label="Last visit" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                    {lastVisit ? formatDate(lastVisit) : "—"}
                  </td>
                  <td data-label="Registered" style={{ padding: "14px 18px", color: "var(--admin-muted)" }}>
                    {formatDate(patient.createdAt as Date)}
                  </td>
                  <td data-label="" style={{ padding: "14px 18px" }}>
                    {showDeleted ? (
                      <form action={restorePatient.bind(null, pid)} style={{ display: "inline" }}>
                        <button
                          type="submit"
                          style={{
                            padding: "7px 14px",
                            borderRadius: 8,
                            background: "var(--admin-card)",
                            border: "1px solid var(--admin-border)",
                            color: "var(--color-brand)",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Restore
                        </button>
                      </form>
                    ) : (
                      <Link
                        href={`/admin/patients/${pid}`}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          background: "var(--admin-card)",
                          border: "1px solid var(--admin-border)",
                          color: "var(--color-brand)",
                          fontSize: 14,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        View →
                      </Link>
                    )}
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
