"use client";

import { useLang } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export type ServiceCardData = {
  slug: string
  image?: string
  name: string
  tag: string
  nameFallback: string
  tagFallback: string
}

export function ServicesSection({ services }: { services: ServiceCardData[] }) {
  const { lang, t } = useLang();
  const reduce = useReducedMotion();

  if (services.length === 0) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.94 },
    show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section
      id="services"
      className="section-container"
      style={{ paddingTop: "clamp(36px,8vw,70px)", paddingBottom: "clamp(20px,5vw,40px)" }}
    >
      <div style={{ maxWidth: "clamp(300px,90%,640px)", marginBottom: "clamp(24px,5vw,40px)" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(32px,4vw,46px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 14px",
            lineHeight: 1.05,
          }}
        >
          {t.svc_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.svc_em}</em>
          {t.svc_post}
        </h2>
        <p style={{ fontSize: 17, color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
          {t.svc_intro}
        </p>
      </div>

      <motion.div
        className="grid-3col"
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        variants={reduce ? undefined : { show: { transition: { staggerChildren: 0.13 } } }}
      >
        {services.map((svc) => {
          const name = lang === "ne" ? svc.nameFallback : svc.name;
          const tag  = lang === "ne" ? svc.tagFallback  : svc.tag;
          return (
          <motion.a
            key={svc.slug}
            href={`/services/${svc.slug}`}
            className="svc-card"
            variants={reduce ? undefined : cardVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 24,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              background: "var(--color-surface)",
              boxShadow: "0 18px 50px -30px rgba(23,42,58,0.4)",
            }}
          >
            <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="svc-img"
                src={svc.image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            <div
              style={{
                padding: "clamp(18px,4vw,28px) clamp(16px,3.5vw,26px) clamp(14px,3vw,22px)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(18px,3.5vw,23px)",
                  lineHeight: 1.16,
                  letterSpacing: "-0.01em",
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                {name}
              </h3>
              <div style={{ flex: 1, minHeight: 26 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    padding: "clamp(6px,2vw,8px) clamp(10px,2.5vw,16px)",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.7)",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: "var(--color-brand)",
                  }}
                >
                  {tag}
                </span>
                <span className="svc-arrow">
                  <ArrowRight size={22} strokeWidth={2.2} color="var(--color-brand)" />
                </span>
              </div>
            </div>
          </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
