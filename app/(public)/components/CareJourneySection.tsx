"use client"

import { useLang } from "@/lib/i18n"
import { motion, useReducedMotion } from "motion/react"

const EASE = [0.22, 0.61, 0.36, 1] as const

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
  const reduce = useReducedMotion()

  return (
    <section
      id='journey'
      className="section-container"
      style={{ paddingTop: "clamp(16px,4vw,30px)", paddingBottom: "clamp(30px,8vw,60px)" }}
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

      <div style={{ position: "relative" }}>
        <svg
          className="journey-path"
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 40 70 C 190 70, 210 150, 360 150 S 560 70, 690 70 S 860 150, 980 150"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeDasharray="2 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <motion.div
          className="grid-4col"
          style={{ alignItems: "stretch", position: "relative", zIndex: 1 }}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          variants={reduce ? undefined : { show: { transition: { staggerChildren: 0.15 } } }}
        >
          {STEPS.map(({ num, titleKey, descKey, offset }, i) => {
          const isTeal = !offset
          const rot = offset ? -2.5 : 2.5
          const shift = offset ? -10 : 10
          const cardVariants = {
            hidden: { opacity: 0, y: 60, rotate: rot, x: shift },
            show:   { opacity: 1, y: 0, rotate: rot, x: shift, transition: { duration: 0.6, ease: EASE } },
          }
          return (
            <motion.div
              key={i}
              className="journey-tilt"
              variants={reduce ? undefined : cardVariants}
              style={{
                borderRadius: 28,
                padding: "clamp(18px,3.5vw,28px) clamp(14px,3vw,24px) clamp(22px,5vw,36px)",
                background: isTeal
                  ? "var(--color-accent)"
                  : "var(--color-brand)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transform: reduce ? `rotate(${rot}deg) translateX(${shift}px)` : undefined,
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
                    width: "clamp(40px,8vw,50px)",
                    height: "clamp(40px,8vw,50px)",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: isTeal
                      ? "var(--color-brand)"
                      : "var(--color-surface)",
                    fontSize: "clamp(13px,2.5vw,15px)",
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
                  fontSize: "clamp(19px,4vw,26px)",
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
                  fontSize: "clamp(14px,3vw,15.5px)",
                  lineHeight: 1.6,
                  color: isTeal ? "var(--color-text)" : "var(--color-surface)",
                  margin: 0,
                }}
              >
                {t[descKey]}
              </p>
            </motion.div>
          )
        })}
        </motion.div>
      </div>
    </section>
  )
}
