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
          padding: "7px 14px",
          borderRadius: 7,
          background: "rgba(192,57,43,0.1)",
          color: "#c0392b",
          fontSize: 14,
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
