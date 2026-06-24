"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

export function AdminSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        width: "fit-content",
        padding: "8px 12px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.1)",
        border: "none",
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      Sign out
    </button>
  )
}
