"use client"

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} style={{ display: "inline" }}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this service? This cannot be undone.")) e.preventDefault()
        }}
        style={{
          fontSize: 14,
          color: "#c0392b",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontWeight: 600,
        }}
      >
        Delete
      </button>
    </form>
  )
}
