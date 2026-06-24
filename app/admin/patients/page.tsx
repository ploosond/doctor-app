import { connectDB } from "@/lib/db"
import { PatientModel } from "@/models/patient"
import { AppointmentModel } from "@/models/appointment"
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
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  await connectDB()

  const filter: Record<string, unknown> = { deletedAt: null }
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ]
  }

  const patients = await PatientModel.find(filter).sort({ createdAt: -1 }).lean()

  // Count appointments per patient
  const patientIds = patients.map((p) => p._id)
  const apptCounts = await AppointmentModel.aggregate([
    { $match: { patientRef: { $in: patientIds } } },
    { $group: { _id: "$patientRef", count: { $sum: 1 } } },
  ])
  const countMap = Object.fromEntries(apptCounts.map((a) => [String(a._id), a.count]))

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
          Patients
        </h1>
      </div>

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
              {["Name", "Phone", "Email", "Appointments", "Registered", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const pid = String(patient._id)
              return (
                <tr key={pid} style={{ borderBottom: "1px solid rgba(23,42,58,0.06)" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 600 }}>{patient.name}</td>
                  <td style={{ padding: "14px 18px" }}>{patient.phone}</td>
                  <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                    {patient.email ?? "—"}
                  </td>
                  <td style={{ padding: "14px 18px" }}>{countMap[pid] ?? 0}</td>
                  <td style={{ padding: "14px 18px", color: "var(--color-text-muted)" }}>
                    {formatDate(patient.createdAt as Date)}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
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
