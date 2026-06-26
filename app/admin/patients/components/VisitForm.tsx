"use client"

import { useState } from "react"

export type VisitInitial = {
  visitDate?: string // yyyy-mm-dd
  notes?: string
  diagnosis?: string
  medication?: string
  followUpDate?: string // yyyy-mm-dd
}

const inputStyle = {
  width: "100%",
  padding: "10px 13px",
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
  fontSize: 13,
  fontWeight: 700,
  color: "var(--color-text-muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: 5,
}

const todayInput = () => new Date().toISOString().slice(0, 10)

export function DeleteVisitButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} style={{ display: "inline" }}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this visit?")) e.preventDefault()
        }}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          background: "transparent",
          color: "#c0392b",
          fontSize: 14,
          fontWeight: 600,
          border: "1.5px solid rgba(192,57,43,0.3)",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </form>
  )
}

export function VisitForm({
  action,
  initialData,
  triggerLabel,
  hidden,
  prefillDate,
}: {
  action: (fd: FormData) => Promise<void>
  initialData?: VisitInitial
  triggerLabel: string
  hidden?: Record<string, string>
  prefillDate?: string
}) {
  const [open, setOpen] = useState(false)
  const isEdit = !!initialData

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: isEdit ? "6px 12px" : "9px 18px",
          borderRadius: 8,
          background: isEdit ? "transparent" : "var(--color-brand)",
          color: isEdit ? "var(--color-brand)" : "#fff",
          fontSize: isEdit ? 14 : 15,
          fontWeight: 600,
          border: isEdit ? "1.5px solid var(--color-accent)" : "none",
          cursor: "pointer",
        }}
      >
        {triggerLabel}
      </button>
    )
  }

  return (
    <form
      action={async (fd) => {
        await action(fd)
        setOpen(false)
      }}
      style={{
        background: "var(--color-surface)",
        borderRadius: 10,
        padding: "16px 18px",
        marginTop: isEdit ? 12 : 0,
      }}
    >
      {hidden &&
        Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Visit date</label>
          <input name="visitDate" type="date" defaultValue={initialData?.visitDate ?? prefillDate ?? todayInput()} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Follow-up date</label>
          <input name="followUpDate" type="date" defaultValue={initialData?.followUpDate ?? ""} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initialData?.notes ?? ""}
          placeholder="What the patient reported, observations…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Diagnosis</label>
          <input name="diagnosis" type="text" defaultValue={initialData?.diagnosis ?? ""} placeholder="Working diagnosis" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Medication</label>
          <input name="medication" type="text" defaultValue={initialData?.medication ?? ""} placeholder="Drug + dosage" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="submit"
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {isEdit ? "Save changes" : "Save visit"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            background: "transparent",
            color: "var(--color-text-muted)",
            fontSize: 15,
            fontWeight: 500,
            border: "1.5px solid var(--color-accent)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
