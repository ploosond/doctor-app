"use client"

import { useLang } from "@/lib/i18n"

const STEPS = [
  {
    num: "01",
    titleKey: "j1t" as const,
    descKey: "j1d" as const,
    offset: true,
  },
  {
    num: "02",
    titleKey: "j2t" as const,
    descKey: "j2d" as const,
    offset: false,
  },
  {
    num: "03",
    titleKey: "j3t" as const,
    descKey: "j3d" as const,
    offset: true,
  },
  {
    num: "04",
    titleKey: "j4t" as const,
    descKey: "j4d" as const,
    offset: false,
  },
]

export function CareJourneySection() {
  const { t } = useLang()

  return (
    <section
      id='journey'
      style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 28px 60px" }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 620,
          margin: "0 auto 46px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(30px,3.6vw,42px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 0",
            lineHeight: 1.08,
          }}
        >
          {t.j_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.j_em}</em>
          {t.j_post}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 22,
          alignItems: "start",
        }}
      >
        {STEPS.map(({ num, titleKey, descKey, offset }, i) => {
          const isTeal = !offset
          return (
            <div
              key={i}
              style={{
                borderRadius: 28,
                padding: "28px 24px 36px",
                background: isTeal
                  ? "var(--color-accent)"
                  : "var(--color-brand)",
                marginTop: offset ? 56 : 0,
                display: "flex",
                flexDirection: "column",
                transform: `rotate(${offset ? -2.5 : 2.5}deg)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: isTeal
                      ? "var(--color-brand)"
                      : "var(--color-surface)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: isTeal ? "#fff" : "var(--color-brand)",
                  }}
                >
                  {num}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  color: isTeal ? "var(--color-text)" : "var(--color-surface)",
                  margin: "0 0 16px",
                }}
              >
                {t[titleKey]}
              </h3>
              <p
                style={{
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  color: isTeal ? "var(--color-text)" : "var(--color-surface)",
                  margin: 0,
                }}
              >
                {t[descKey]}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
