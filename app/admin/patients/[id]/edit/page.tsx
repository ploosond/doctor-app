import { notFound } from "next/navigation"
import Link from "next/link"
import { getPatient } from "@/lib/services/patients"
import { PatientForm, type PatientDoc } from "../../components/PatientForm"
import { updatePatient } from "../../actions"

function toDateInput(d?: Date | null): string | undefined {
  if (!d) return undefined
  return new Date(d).toISOString().slice(0, 10)
}

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const patient = await getPatient(id)
  if (!patient) notFound()

  const initialData: PatientDoc = {
    _id: String(patient._id),
    name: patient.name,
    phone: patient.phone,
    email: patient.email ?? undefined,
    dateOfBirth: toDateInput(patient.dateOfBirth),
    gender: patient.gender ?? undefined,
    address: patient.address ?? undefined,
    occupation: patient.occupation ?? undefined,
    emergencyContactName: patient.emergencyContactName ?? undefined,
    emergencyContactPhone: patient.emergencyContactPhone ?? undefined,
    referralSource: patient.referralSource ?? undefined,
    alerts: patient.alerts ?? undefined,
    consentGiven: patient.consentGiven ?? false,
  }

  return (
    <div style={{ padding: "36px 40px", maxWidth: 800 }}>
      <div style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/patients" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Patients
        </Link>
        {" / "}
        <Link href={`/admin/patients/${id}`} style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          {patient.name}
        </Link>
        {" / Edit"}
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
        Edit patient
      </h1>
      <PatientForm action={updatePatient.bind(null, id)} initialData={initialData} />
    </div>
  )
}
