"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { AdminSignOut } from "./AdminSignOut"

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Availability", href: "/admin/availability" },
  { label: "Patients", href: "/admin/patients" },
  { label: "Services", href: "/admin/services" },
]

function navLinkStyle(active: boolean) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: active ? "#fff" : "rgba(255,255,255,0.85)",
    background: active ? "rgba(255,255,255,0.14)" : "transparent",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
  } as const
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
      {NAV.map(({ label, href }) => (
        <Link key={href} href={href} onClick={onNavigate} style={navLinkStyle(pathname.startsWith(href))}>
          {label}
        </Link>
      ))}
    </nav>
  )
}

function PanelInner({
  email,
  pathname,
  onNavigate,
}: {
  email: string
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <>
      <div style={{ padding: "28px 20px 20px" }}>
        <Link href="/admin/dashboard" onClick={onNavigate}>
          <Logo height={54} />
        </Link>
      </div>
      <NavList pathname={pathname} onNavigate={onNavigate} />
      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 10,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </div>
        <AdminSignOut />
      </div>
    </>
  )
}

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const panelBg = { background: "var(--color-brand)" } as const

  return (
    <>
      {/* Desktop fixed rail */}
      <aside
        className="admin-sidebar"
        style={{
          ...panelBg,
          width: 240,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <PanelInner email={email} pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <header
        className="admin-topbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          zIndex: 30,
          background: "var(--color-brand)",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
        }}
      >
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: 4 }}
        >
          <Menu size={24} />
        </button>
        <Link href="/admin/dashboard" style={{ display: "flex" }}>
          <Logo height={34} />
        </Link>
      </header>

      {/* Mobile drawer + backdrop */}
      {open && <div className="admin-drawer-backdrop" onClick={close} />}
      <div className={`admin-drawer${open ? " open" : ""}`} style={panelBg}>
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            padding: 4,
          }}
        >
          <X size={22} />
        </button>
        <PanelInner email={email} pathname={pathname} onNavigate={close} />
      </div>
    </>
  )
}
