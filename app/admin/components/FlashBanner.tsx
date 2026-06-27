const MESSAGES: Record<string, { text: string; tone: "success" | "error" }> = {
  created: { text: "Created.", tone: "success" },
  updated: { text: "Changes saved.", tone: "success" },
  deleted: { text: "Deleted.", tone: "success" },
  saved: { text: "Availability saved.", tone: "success" },
  status: { text: "Status updated.", tone: "success" },
  notes: { text: "Notes saved.", tone: "success" },
  visit_added: { text: "Visit added.", tone: "success" },
  visit_updated: { text: "Visit updated.", tone: "success" },
  visit_deleted: { text: "Visit deleted.", tone: "success" },
  restored: { text: "Patient restored.", tone: "success" },
  visibility: { text: "Visibility updated.", tone: "success" },
}

const TONE = {
  success: { color: "#1f7a4d", background: "#e8f5ee", border: "#c4e6d4" },
  error: { color: "#c0392b", background: "#fdecea", border: "#f5c6c0" },
}

export function FlashBanner({ code }: { code?: string }) {
  if (!code) return null
  const msg = MESSAGES[code]
  if (!msg) return null
  const t = TONE[msg.tone]

  return (
    <div
      role="status"
      style={{
        padding: "11px 16px",
        marginBottom: 20,
        borderRadius: 8,
        border: `1px solid ${t.border}`,
        background: t.background,
        color: t.color,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {msg.text}
    </div>
  )
}
