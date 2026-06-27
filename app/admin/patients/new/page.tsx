import Link from "next/link"
import { PatientForm } from "../components/PatientForm"
import { createPatient } from "../actions"
import { breadcrumbStyle } from "@/app/admin/ui"

export default function NewPatientPage() {
  return (
    <div className="admin-page" style={{ maxWidth: 800 }}>
      <div style={breadcrumbStyle}>
        <Link href="/admin/patients" style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          Patients
        </Link>
        {" / New"}
      </div>
      <h1 className="admin-h1">New patient</h1>
      <PatientForm action={createPatient} />
    </div>
  )
}
