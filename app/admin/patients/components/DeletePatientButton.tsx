"use client"

export function DeletePatientButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} style={{ display: "inline" }}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this patient? They will be removed from the list.")) e.preventDefault()
        }}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          background: "rgba(192,57,43,0.1)",
          color: "#c0392b",
          fontSize: 15,
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </form>
  )
}
