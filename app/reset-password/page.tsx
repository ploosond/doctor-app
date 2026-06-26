"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { resetPassword } from "@/lib/auth-client"

const cardWrap = {
  minHeight: "100vh",
  background: "var(--color-surface)",
  display: "grid",
  placeItems: "center" as const,
  padding: "24px",
}
const card = {
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  borderRadius: 20,
  padding: "40px 36px",
  boxShadow: "0 4px 24px rgba(23,42,58,0.1)",
}
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--color-accent)",
  fontSize: 15,
  color: "var(--color-text)",
  outline: "none",
  boxSizing: "border-box" as const,
}

function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get("token") ?? ""
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await resetPassword({ newPassword: password, token })
    setLoading(false)
    if (res.error) setError(res.error.message ?? "Reset link is invalid or expired")
    else router.push("/login")
  }

  return (
    <div style={cardWrap}>
      <div style={card}>
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
          Set a new password
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: "0 0 24px" }}>
          Choose a strong password for your admin account.
        </p>

        {!token ? (
          <p
            style={{
              fontSize: 14.5,
              color: "#c0392b",
              background: "rgba(192,57,43,0.08)",
              padding: "12px 14px",
              borderRadius: 10,
            }}
          >
            Missing or invalid reset link. Request a new one from{" "}
            <Link href="/forgot-password" style={{ color: "var(--color-brand)", fontWeight: 600 }}>
              forgot password
            </Link>
            .
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
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                style={inputStyle}
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
              {loading ? "Saving…" : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={cardWrap} />}>
      <ResetForm />
    </Suspense>
  )
}
