import Link from "next/link"
import { notFound } from "next/navigation"
import { getAppointment } from "@/lib/services/appointments"
import { listServices } from "@/lib/services/catalog"
import { updateAppointment } from "../../actions"
import { AppointmentSlotPicker } from "../../components/AppointmentSlotPicker"
import { SubmitButton } from "@/app/admin/components/SubmitButton"
import { cardStyle as card, inputStyle, labelStyle, breadcrumbStyle, primaryBtnStyle, secondaryBtnStyle } from "@/app/admin/ui"

function toDateInput(d: Date): string {
  return new Date(d).toISOString().slice(0, 10)
}

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const appt = await getAppointment(id)
  if (!appt) notFound()

  const patient = appt.patientRef as unknown as { name: string; phone: string }
  const date = toDateInput(appt.slotStart as Date)
  const services = await listServices({ visibleOnly: true })

  const currentSlotValue = `${new Date(appt.slotStart as Date).toISOString()}|${new Date(appt.slotEnd as Date).toISOString()}`

  return (
    <div className="admin-page" style={{ maxWidth: 800 }}>
      <div style={breadcrumbStyle}>
        <Link href="/admin/appointments" style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          Appointments
        </Link>
        {" / "}
        <Link href={`/admin/appointments/${id}`} style={{ color: "var(--admin-muted)", textDecoration: "none" }}>
          {patient?.name ?? "Appointment"}
        </Link>
        {" / Reschedule"}
      </div>
      <h1 className="admin-h1">Reschedule appointment</h1>

      {/* Patient (read-only) */}
      <div style={card}>
        <label style={labelStyle}>Patient</label>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text)" }}>
          {patient?.name} · {patient?.phone}
        </div>
      </div>

      <form action={updateAppointment.bind(null, id)}>
        {/* Service + mode */}
        <div style={card}>
          <div className="admin-grid-2" style={{ gap: 16 }}>
            <div>
              <label style={labelStyle}>Service</label>
              <select name="service" required defaultValue={appt.service as string} style={inputStyle}>
                {services.map((s) => {
                  const name = (s.content as { en?: { name?: string } })?.en?.name ?? s.slug
                  return (
                    <option key={s.slug} value={s.slug}>
                      {name}
                    </option>
                  )
                })}
                {/* keep current service selectable even if now hidden */}
                {!services.some((s) => s.slug === appt.service) && (
                  <option value={appt.service as string}>{appt.service as string}</option>
                )}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Mode</label>
              <select name="mode" defaultValue={appt.mode as string} style={inputStyle}>
                <option value="in_person">In person</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date / time picker */}
        <div style={card}>
          <AppointmentSlotPicker initialDateISO={date} initialSlotValue={currentSlotValue} excludeId={id} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <SubmitButton label="Save changes" style={primaryBtnStyle} />
          <Link href={`/admin/appointments/${id}`} style={secondaryBtnStyle}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
