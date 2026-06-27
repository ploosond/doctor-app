import { notFound } from "next/navigation"
import Link from "next/link"
import { getPatient, listVisitsByPatient } from "@/lib/services/patients"
import { updatePatientNotes, deletePatient, addVisit, updateVisit, deleteVisit } from "../actions"
import { VisitForm, DeleteVisitButton } from "../components/VisitForm"
import { DeletePatientButton } from "../components/DeletePatientButton"
import { FlashBanner } from "@/app/admin/components/FlashBanner"
import { cardStyle, breadcrumbStyle } from "@/app/admin/ui"

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function toDateInput(d?: Date | null): string | undefined {
  if (!d) return undefined
  return new Date(d).toISOString().slice(0, 10)
}

function ageFrom(dob?: Date | null): string {
  if (!dob) return "—"
  const d = new Date(dob)
  const diff = Date.now() - d.getTime()
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  return `${age} yrs`
}

const sectionHead = {
  fontFamily: "var(--font-sans), sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "var(--color-text)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
}

export default async function PatientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  const { id } = await params
  const { flash } = await searchParams

  const patient = await getPatient(id)
  if (!patient) notFound()

  const visits = await listVisitsByPatient(String(patient._id))

  const patientId = String(patient._id)
  const lastVisit = visits[0]
  const nextFollowUp = visits.find((v) => v.followUpDate)?.followUpDate

  return (
    <div className="admin-page">
      <FlashBanner code={flash} />
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <Link href="/admin/patients" style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          Patients
        </Link>
        {" / "}
        {patient.name}
      </div>

      <div className="admin-page-head">
        <h1 className="admin-h1" style={{ margin: 0 }}>
          {patient.name}
        </h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href={`/admin/appointments/new?patient=${patientId}`}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "var(--color-brand)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Book appointment
          </Link>
          <Link
            href={`/admin/patients/${patientId}/edit`}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#FAFBFC",
              color: "var(--color-brand)",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Edit
          </Link>
          <DeletePatientButton action={deletePatient.bind(null, patientId)} />
        </div>
      </div>

      {/* Alerts banner */}
      {patient.alerts && (
        <div
          style={{
            background: "rgba(192,57,43,0.06)",
            border: "1.5px solid rgba(192,57,43,0.25)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 24,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ color: "#c0392b", fontSize: 18, lineHeight: 1.2 }}>⚠</span>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#c0392b",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 3,
              }}
            >
              Alerts
            </div>
            <div style={{ fontSize: 16, color: "var(--color-text)", whiteSpace: "pre-wrap" }}>
              {patient.alerts as string}
            </div>
          </div>
        </div>
      )}

      <div className="admin-grid-side">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile */}
          <div style={cardStyle}>
            <h2 style={{ ...sectionHead, margin: "0 0 16px" }}>Profile</h2>
            {[
              ["Phone", patient.phone],
              ["Email", patient.email ?? "—"],
              ["Age", ageFrom(patient.dateOfBirth as Date | undefined)],
              ["Gender", patient.gender ?? "—"],
              ["Occupation", patient.occupation ?? "—"],
              ["Address", patient.address ?? "—"],
              ["Emergency", patient.emergencyContactName
                ? `${patient.emergencyContactName}${patient.emergencyContactPhone ? ` · ${patient.emergencyContactPhone}` : ""}`
                : "—"],
              ["Referral", patient.referralSource ?? "—"],
              ["Consent", patient.consentGiven ? "Given" : "Not given"],
              ["Registered", formatDate(patient.createdAt as Date)],
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
          </div>

          {/* Visit stats */}
          <div style={cardStyle}>
            <h2 style={{ ...sectionHead, margin: "0 0 16px" }}>Chart summary</h2>
            {[
              ["Total visits", String(visits.length)],
              ["Last visit", lastVisit ? formatDate(lastVisit.visitDate as Date) : "—"],
              ["Next follow-up", nextFollowUp ? formatDate(nextFollowUp as Date) : "—"],
              ["Current diagnosis", (lastVisit?.diagnosis as string) ?? "—"],
              ["Current medication", (lastVisit?.medication as string) ?? "—"],
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
                <span style={{ color: "var(--color-text)", fontWeight: 600, textAlign: "right" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Admin notes */}
          <div style={cardStyle}>
            <h2 style={{ ...sectionHead, margin: "0 0 12px" }}>Admin notes</h2>
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

        {/* Right column — visits timeline */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ ...sectionHead, margin: 0 }}>Visits ({visits.length})</h2>
            <VisitForm action={addVisit.bind(null, patientId)} triggerLabel="+ Add visit" />
          </div>

          {visits.length === 0 ? (
            <p style={{ color: "var(--admin-muted)", fontSize: 16, margin: 0 }}>
              No visits recorded yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {visits.map((v) => {
                const vid = String(v._id)
                return (
                  <div
                    key={vid}
                    style={{
                      border: "1px solid rgba(23,42,58,0.1)",
                      borderRadius: 12,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text)" }}>
                        {formatDate(v.visitDate as Date)}
                      </span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <VisitForm
                          action={updateVisit.bind(null, vid, patientId)}
                          triggerLabel="Edit"
                          initialData={{
                            visitDate: toDateInput(v.visitDate as Date),
                            notes: (v.notes as string) ?? "",
                            diagnosis: (v.diagnosis as string) ?? "",
                            medication: (v.medication as string) ?? "",
                            followUpDate: toDateInput(v.followUpDate as Date | undefined),
                          }}
                        />
                        <DeleteVisitButton action={deleteVisit.bind(null, vid, patientId)} />
                      </div>
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
                          <strong style={{ color: "var(--color-text)" }}>Follow-up:</strong> {formatDate(v.followUpDate as Date)}
                        </span>
                      )}
                      {v.appointmentRef && (
                        <Link
                          href={`/admin/appointments/${String(v.appointmentRef)}`}
                          style={{ color: "var(--color-brand)", fontWeight: 600, textDecoration: "none" }}
                        >
                          From appointment →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
