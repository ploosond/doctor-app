"use client"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
        background: "var(--color-bg)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 460 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(24px,4vw,32px)",
            color: "var(--color-text)",
            margin: "0 0 12px",
          }}
        >
          Something went wrong
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
          An unexpected error occurred. Please try again — if it keeps happening, contact the clinic.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "13px 28px",
            borderRadius: 999,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </main>
  )
}
