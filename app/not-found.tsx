import Link from "next/link"

export default function NotFound() {
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
        <div
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "clamp(64px,14vw,110px)",
            fontWeight: 500,
            lineHeight: 1,
            color: "var(--color-accent)",
            marginBottom: 12,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(24px,4vw,32px)",
            color: "var(--color-text)",
            margin: "0 0 12px",
          }}
        >
          Page not found
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "13px 28px",
            borderRadius: 999,
            background: "var(--color-brand)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
