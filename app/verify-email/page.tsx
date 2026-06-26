"use client"

import { useState } from "react"
import Link from "next/link"
import { sendVerificationEmail } from "@/lib/auth-client"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await sendVerificationEmail({ email, callbackURL: "/admin/dashboard" })
    setLoading(false)
    if (res.error) setError(res.error.message ?? "Something went wrong")
    else setSent(true)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-surface)",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 4px 24px rgba(23,42,58,0.1)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: "0 0 6px",
          }}
        >
          Verify your email
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 24px" }}>
          Open the link we emailed you to finish signing in. Need a new one?
        </p>

        {sent ? (
          <p
            style={{
              fontSize: 14.5,
              color: "var(--color-text)",
              background: "var(--color-surface)",
              padding: "12px 14px",
              borderRadius: 10,
            }}
          >
            A fresh verification link is on its way to <strong>{email}</strong>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--color-accent)",
                  fontSize: 15,
                  color: "var(--color-text)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  color: "#c0392b",
                  background: "rgba(192,57,43,0.08)",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "12px",
                borderRadius: 10,
                background: "var(--color-brand)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending…" : "Resend verification"}
            </button>
          </form>
        )}

        <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "20px 0 0" }}>
          <Link href="/login" style={{ color: "var(--color-brand)", fontWeight: 600, textDecoration: "none" }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
