"use client"

import { useLang } from "@/lib/i18n"
import { Check, ArrowRight } from "lucide-react"

const CHECKS = ["chk1", "chk2", "chk3", "chk4", "chk5", "chk6"] as const

export function AboutSection() {
  const { t } = useLang()

  return (
    <section
      id='about'
      style={{
        width: "100%",
        background: "var(--color-surface)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div className='section-inner grid-about'>
        {/* Left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding:
              "clamp(36px,8vw,72px) 0 clamp(36px,8vw,72px) clamp(16px,4vw,28px)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontWeight: 400,
              fontSize: "clamp(34px,3.8vw,52px)",
              letterSpacing: "-0.02em",
              margin: "0 0 26px",
              lineHeight: 1.06,
              color: "var(--color-text)",
            }}
          >
            {t.about_pre}
            <br />
            <em style={{ fontStyle: "italic" }}>{t.about_em}</em>
            {t.about_post}
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "var(--color-text-muted)",
              lineHeight: 1.65,
              margin: "0 0 18px",
              maxWidth: "clamp(260px,90%,380px)",
            }}
          >
            {t.about_p1}
          </p>
          <p
            style={{
              fontSize: 16.5,
              color: "var(--color-text-muted)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: "clamp(260px,90%,380px)",
            }}
          >
            {t.about_p2}
          </p>
        </div>

        {/* Center: photo placeholder */}
        <div
          style={{
            position: "relative",
            alignSelf: "end",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='about-photo'
            src={"/about/doctor.jpeg"}
            alt='Dr. Lila'
          />
        </div>

        {/* Right: checklist */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding:
              "clamp(36px,8vw,72px) clamp(16px,4vw,28px) clamp(36px,8vw,72px) 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {CHECKS.map((key) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <Check
                  size={18}
                  strokeWidth={2.4}
                  color='var(--color-brand)'
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 16,
                    color: "var(--color-text)",
                    lineHeight: 1.4,
                  }}
                >
                  {t[key]}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 38 }}>
            <div
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.02em",
                color: "var(--color-text)",
              }}
            >
              DR. LILA, MRCPsych
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--color-text-muted)",
                marginTop: 3,
              }}
            >
              {t.sig_role}
            </div>
          </div>
        </div>
      </div>

      {/* Where I practice strip */}
      <div className='section-container' style={{ paddingBottom: 64 }}>
        <div
          style={{
            borderTop: "1px solid rgba(23,42,58,0.14)",
            paddingTop: 34,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-brand)",
              marginBottom: 6,
            }}
          >
            {t.practice_label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(18px,4vw,24px)",
              fontStyle: "italic",
              color: "var(--color-text)",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            {t.practice_head}
          </div>
          <div className='grid-3col' style={{ gap: 20 }}>
            {t.clinics.map((clinic) => (
              <div
                key={clinic.name}
                className='svc-card'
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(23,42,58,0.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Map embed */}
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
                  width='100%'
                  height='160'
                  style={{
                    display: "block",
                    border: "none",
                    width: "100%",
                    flex: 1,
                    minHeight: 170,
                  }}
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title={clinic.name}
                />
                {/* Info */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-sans), sans-serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--color-text)",
                          marginBottom: 2,
                        }}
                      >
                        {clinic.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {clinic.address}
                      </div>
                    </div>
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='svc-arrow'
                      style={{ flexShrink: 0, textDecoration: "none" }}
                    >
                      <ArrowRight
                        size={20}
                        strokeWidth={2.2}
                        color='var(--color-brand)'
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
