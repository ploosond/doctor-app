"use client"

import Link from "next/link"

export type PatientDoc = {
  _id: string
  name: string
  phone: string
  email?: string
  dateOfBirth?: string // yyyy-mm-dd
  gender?: string
  address?: string
  occupation?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  referralSource?: string
  alerts?: string
  consentGiven?: boolean
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 8,
  border: "1.5px solid var(--color-accent)",
  fontSize: 16,
  color: "var(--color-text)",
  boxSizing: "border-box" as const,
  fontFamily: "var(--font-sans), sans-serif",
  background: "#fff",
}

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  color: "var(--color-text-muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: 6,
}

const sectionHead = {
  fontFamily: "var(--font-sans), sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "var(--color-text)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  margin: "0 0 14px",
  paddingBottom: 8,
  borderBottom: "1px solid rgba(23,42,58,0.08)",
}

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 2px 8px rgba(23,42,58,0.06)",
  marginBottom: 16,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export function PatientForm({
  action,
  initialData,
}: {
  action: (fd: FormData) => Promise<void>
  initialData?: PatientDoc
}) {
  const isEdit = !!initialData

  return (
    <form action={action}>
      {/* Identity */}
      <div style={card}>
        <div style={sectionHead}>Identity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Name *">
            <input name="name" type="text" required defaultValue={initialData?.name ?? ""} placeholder="Full name" style={inputStyle} />
          </Field>
          <Field label="Phone *">
            <input name="phone" type="text" required defaultValue={initialData?.phone ?? ""} placeholder="98XXXXXXXX" style={inputStyle} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" defaultValue={initialData?.email ?? ""} placeholder="optional" style={inputStyle} />
          </Field>
          <Field label="Date of birth">
            <input name="dateOfBirth" type="date" defaultValue={initialData?.dateOfBirth ?? ""} style={inputStyle} />
          </Field>
          <Field label="Gender">
            <select name="gender" defaultValue={initialData?.gender ?? ""} style={inputStyle}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Occupation">
            <input name="occupation" type="text" defaultValue={initialData?.occupation ?? ""} placeholder="optional" style={inputStyle} />
          </Field>
        </div>
        <Field label="Address">
          <input name="address" type="text" defaultValue={initialData?.address ?? ""} placeholder="optional" style={inputStyle} />
        </Field>
      </div>

      {/* Emergency + referral */}
      <div style={card}>
        <div style={sectionHead}>Emergency contact & referral</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Emergency contact name">
            <input name="emergencyContactName" type="text" defaultValue={initialData?.emergencyContactName ?? ""} placeholder="optional" style={inputStyle} />
          </Field>
          <Field label="Emergency contact phone">
            <input name="emergencyContactPhone" type="text" defaultValue={initialData?.emergencyContactPhone ?? ""} placeholder="optional" style={inputStyle} />
          </Field>
        </div>
        <Field label="Referral source">
          <input name="referralSource" type="text" defaultValue={initialData?.referralSource ?? ""} placeholder="e.g. self, GP referral, family" style={inputStyle} />
        </Field>
      </div>

      {/* Alerts */}
      <div style={card}>
        <div style={sectionHead}>Key alerts</div>
        <Field label="Allergies / risk flags">
          <textarea
            name="alerts"
            rows={2}
            defaultValue={initialData?.alerts ?? ""}
            placeholder="e.g. Allergic to penicillin · Suicide risk — monitor"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>
          <input name="consentGiven" type="checkbox" defaultChecked={initialData?.consentGiven ?? false} style={{ width: 15, height: 15 }} />
          Consent given for record keeping
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          style={{
            padding: "12px 28px",
            borderRadius: 10,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {isEdit ? "Update patient" : "Create patient"}
        </button>
        <Link
          href={isEdit ? `/admin/patients/${initialData!._id}` : "/admin/patients"}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "1.5px solid var(--color-accent)",
            color: "var(--color-text-muted)",
            fontSize: 16,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
