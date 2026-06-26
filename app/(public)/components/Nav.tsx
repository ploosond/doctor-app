"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLang } from "@/lib/i18n"
import { CalendarDays, Menu, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { uppercase } from "better-auth"

const NAV_LINKS = [
  ["#services", "nav_services"] as const,
  ["#about", "nav_about"] as const,
  ["#journey", "nav_journey"] as const,
  ["#faq", "nav_faq"] as const,
  ["#contact", "nav_contact"] as const,
]

export function Nav() {
  const { t, lang, setLang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: scrolled ? 0 : 16,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: "0 20px",
          transition: "top 0.3s ease",
        }}
      >
        <nav
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            borderRadius: 999,
            background: scrolled
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.72)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(116,179,206,0.35)",
            boxShadow: scrolled
              ? "0 4px 30px -8px rgba(23,42,58,0.12)"
              : "none",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {/* Left: logo + desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link
              href='/'
              style={{ display: "inline-flex", textDecoration: "none" }}
            >
              <Logo height={54} />
            </Link>

            <div className='nav-links'>
              {NAV_LINKS.map(([href, key]) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "var(--font-zilla-slab), serif",
                    textDecoration: "none",
                    color: "var(--color-text-muted)",
                    fontSize: 18.5,
                    fontWeight: 600,
                    transition: "color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-brand)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--color-text-muted)")
                  }
                >
                  {t[key]}
                </a>
              ))}
            </div>
          </div>

          {/* Right: desktop CTA + lang + mobile hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Desktop CTA + divider + lang */}
            <div className='nav-cta-wrap'>
              <Link
                href='/#booking'
                className='btn-primary'
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(180deg,rgba(255,255,255,.25) 0%,transparent 60%),var(--color-brand)",
                  whiteSpace: "nowrap",
                }}
              >
                <CalendarDays size={15} strokeWidth={2} />
                {t.nav_book}
              </Link>

              <span
                style={{
                  width: 1,
                  height: 26,
                  background: "rgba(23,42,58,0.14)",
                }}
              />
            </div>

            {/* Language switcher — always visible */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label='Change language'
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 8px rgba(23,42,58,0.18)",
                  cursor: "pointer",
                  padding: 0,
                  overflow: "hidden",
                  background: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${lang === "en" ? "gb" : "np"}.svg`}
                  width={28}
                  height={28}
                  alt={lang === "en" ? "English" : "Nepali"}
                  style={{ display: "block", width: "100%", height: "100%" }}
                />
              </button>

              {langOpen && (
                <>
                  <div
                    onClick={() => setLangOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 90 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 11px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 91,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      padding: 6,
                      borderRadius: 16,
                      background: "#fff",
                      border: "1px solid rgba(23,42,58,0.08)",
                      boxShadow: "0 22px 50px -22px rgba(23,42,58,0.5)",
                      animation: "popMenu 0.18s ease both",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: -7,
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 14,
                        height: 14,
                        background: "#fff",
                        borderLeft: "1px solid rgba(23,42,58,0.08)",
                        borderTop: "1px solid rgba(23,42,58,0.08)",
                        borderRadius: "4px 0 0 0",
                      }}
                    />
                    {(["en", "ne"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l)
                          setLangOpen(false)
                        }}
                        style={{
                          width: 48,
                          height: 44,
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            lang === l ? "rgba(0,67,70,0.1)" : "transparent",
                          transition: "background 0.15s",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://hatscripts.github.io/circle-flags/flags/${l === "en" ? "gb" : "np"}.svg`}
                          width={22}
                          height={22}
                          alt={l === "en" ? "English" : "Nepali"}
                          style={{ display: "block" }}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className='nav-hamburger'
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X size={22} strokeWidth={2.2} />
              ) : (
                <Menu size={22} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className='nav-mobile-panel' onClick={closeMenu}>
          {NAV_LINKS.map(([href, key]) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-zilla-slab), serif",
                fontSize: 18.5,
                textTransform: "uppercase",
              }}
              className='nav-mobile-link'
            >
              {t[key]}
            </a>
          ))}
          <Link href='/#booking' className='nav-mobile-cta'>
            <CalendarDays size={16} strokeWidth={2} />
            {t.nav_book}
          </Link>
        </div>
      )}
    </>
  )
}
