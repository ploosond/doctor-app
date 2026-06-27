// Shared admin style primitives — single source of truth so pages don't drift.
// Plain/functional, neutral --admin-* tokens, no animation (see admin UI memory).
import type { CSSProperties } from "react"

export const cardStyle: CSSProperties = {
  background: "var(--admin-card)",
  border: "1px solid var(--admin-border)",
  borderRadius: 12,
  padding: "22px 24px",
  boxShadow: "var(--admin-shadow)",
  marginBottom: 16,
}

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--admin-border)",
  fontSize: 15,
  color: "var(--color-text)",
  background: "var(--admin-card)",
  boxSizing: "border-box",
  fontFamily: "var(--font-sans), sans-serif",
}

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--admin-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 6,
}

export const sectionHeadStyle: CSSProperties = {
  fontFamily: "var(--font-sans), sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "var(--color-text)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  margin: "0 0 14px",
  paddingBottom: 8,
  borderBottom: "1px solid var(--admin-border)",
}

export const breadcrumbStyle: CSSProperties = {
  fontSize: 15,
  color: "var(--admin-muted)",
  marginBottom: 20,
}

export const primaryBtnStyle: CSSProperties = {
  padding: "12px 28px",
  borderRadius: 8,
  background: "var(--color-brand)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
  border: "none",
}

export const secondaryBtnStyle: CSSProperties = {
  padding: "12px 24px",
  borderRadius: 8,
  background: "var(--admin-card)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-muted)",
  fontSize: 16,
  fontWeight: 500,
  textDecoration: "none",
}

export const smallBtnStyle: CSSProperties = {
  padding: "7px 14px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
}
