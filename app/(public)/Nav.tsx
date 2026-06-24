"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/lib/i18n"
import { CalendarDays } from "lucide-react"

export function Nav() {
  const { t, lang, setLang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
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
          padding: "8px 14px",
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
          boxShadow: scrolled ? "0 4px 30px -8px rgba(23,42,58,0.12)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Left: logo + links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a
            href='/'
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 24px",
              borderRadius: 999,
              background: "var(--color-brand)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontWeight: 800,
                fontSize: 21,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              dr.lila
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                alignSelf: "flex-end",
                margin: "0 0 4px 3px",
              }}
            />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {[
              ["#about", t.nav_about],
              ["#services", t.nav_services],
              ["#journey", t.nav_journey],
              ["#faq", t.nav_faq],
              ["#contact", t.nav_contact],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  color: "var(--color-text-muted)",
                  fontSize: 14.5,
                  fontWeight: 600,
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-brand)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-text-muted)")
                }
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: CTA + language */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a
            href='#booking'
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
          </a>

          <span
            style={{
              width: 1,
              height: 26,
              background: "rgba(23,42,58,0.14)",
            }}
          />

          {/* Language switcher */}
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
        </div>
      </nav>
    </header>
  )
}
