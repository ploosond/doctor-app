import { listPatients, latestVisitByPatient } from "@/lib/services/patients"
import { restorePatient } from "./actions"
import Link from "next/link"

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
  searchParams: Promise<{ q?: string; deleted?: string }>
}) {
  const { q, deleted } = await searchParams
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
          {showDeleted ? "Deleted patients" : "Patients"}
        </h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href={showDeleted ? "/admin/patients" : "/admin/patients?deleted=1"}
            style={{
              fontSize: 14,
              color: "var(--color-text-muted)",
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
                padding: "11px 22px",
                borderRadius: 10,
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
            padding: "12px 18px",
            borderRadius: 10,
            border: "1.5px solid var(--color-accent)",
            fontSize: 16,
            color: "var(--color-text)",
            width: 320,
            outline: "none",
          }}
        />
      </form>

      {patients.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: 16,
            background: "var(--color-surface)",
            borderRadius: 12,
          }}
        >
          {q ? `No patients matching "${q}".` : "No patients yet."}
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 16,
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
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {["Name", "Phone", "Email", "Last visit", "Registered", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600 }}>
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
                <tr key={pid} style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 600 }}>
                    {patient.alerts && (
                      <span title="Has alerts" style={{ color: "#c0392b", marginRight: 6 }}>
                        ⚠
                      </span>
                    )}
                    {patient.name}
                  </td>
                  <td style={{ padding: "14px 18px" }}>{patient.phone}</td>
                  <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                    {patient.email ?? "—"}
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                    {lastVisit ? formatDate(lastVisit) : "—"}
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                    {formatDate(patient.createdAt as Date)}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    {showDeleted ? (
                      <form action={restorePatient.bind(null, pid)} style={{ display: "inline" }}>
                        <button
                          type="submit"
                          style={{
                            padding: "7px 14px",
                            borderRadius: 7,
                            background: "var(--color-surface)",
                            color: "var(--color-brand)",
                            fontSize: 14,
                            fontWeight: 600,
                            border: "none",
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
                          borderRadius: 7,
                          background: "var(--color-surface)",
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
