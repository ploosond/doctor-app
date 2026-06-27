import Link from "next/link"
import { listPatients } from "@/lib/services/patients"
import { listServices } from "@/lib/services/catalog"
import { createAppointment } from "../actions"
import { AppointmentSlotPicker } from "../components/AppointmentSlotPicker"
import { SubmitButton } from "@/app/admin/components/SubmitButton"
import { cardStyle as card, inputStyle, labelStyle, breadcrumbStyle, primaryBtnStyle, secondaryBtnStyle } from "@/app/admin/ui"

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>
}) {
  const { patient } = await searchParams

  const [patients, services] = await Promise.all([
    listPatients({}),
    listServices({ visibleOnly: true }),
  ])

  return (
    <div className="admin-page" style={{ maxWidth: 800 }}>
      <div style={breadcrumbStyle}>
        <Link href="/admin/appointments" style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / New"}
      </div>
      <h1 className="admin-h1">New appointment</h1>

      <form action={createAppointment}>
        {/* Patient + service */}
        <div style={card}>
          <div className="admin-grid-2" style={{ gap: 16 }}>
            <div>
              <label style={labelStyle}>Patient</label>
              <select name="patientRef" required defaultValue={patient ?? ""} style={inputStyle}>
                <option value="" disabled>
                  Select patient…
                </option>
                {patients.map((p) => (
                  <option key={String(p._id)} value={String(p._id)}>
                    {p.name} · {p.phone}
                  </option>
                ))}
              </select>
              <Link
                href="/admin/patients/new"
                style={{ fontSize: 14, color: "var(--color-brand)", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 6 }}
              >
                + New patient
              </Link>
            </div>
            <div>
              <label style={labelStyle}>Service</label>
              <select name="service" required defaultValue="" style={inputStyle}>
                <option value="" disabled>
                  Select service…
                </option>
                {services.map((s) => {
                  const name = (s.content as { en?: { name?: string } })?.en?.name ?? s.slug
                  return (
                    <option key={s.slug} value={s.slug}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Mode + status */}
        <div style={card}>
          <div className="admin-grid-2" style={{ gap: 16 }}>
            <div>
              <label style={labelStyle}>Mode</label>
              <select name="mode" defaultValue="in_person" style={inputStyle}>
                <option value="in_person">In person</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" defaultValue="confirmed" style={inputStyle}>
                <option value="confirmed">Confirmed</option>
                <option value="requested">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date / time picker */}
        <div style={card}>
          <AppointmentSlotPicker />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <SubmitButton label="Create appointment" pendingLabel="Creating…" style={primaryBtnStyle} />
          <Link href="/admin/appointments" style={secondaryBtnStyle}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
