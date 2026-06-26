import Link from "next/link"
import { PatientForm } from "../components/PatientForm"
import { createPatient } from "../actions"

export default function NewPatientPage() {
  return (
    <div style={{ padding: "36px 40px", maxWidth: 800 }}>
      <div style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <Link href="/admin/patients" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
          Patients
        </Link>
        {" / New"}
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
        New patient
      </h1>
      <PatientForm action={createPatient} />
    </div>
  )
}
