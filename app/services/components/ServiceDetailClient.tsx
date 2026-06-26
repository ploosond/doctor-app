"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { Nav } from "@/app/(public)/components/Nav"
import { Footer } from "@/app/(public)/components/Footer"

interface Step { title: string; desc: string }
interface LocaleContent {
  name: string
  tag: string
  headline: string
  intro: string
  duration: string
  format: string
  price: string
  followup: string
  included: string[]
  steps: Step[]
}
export interface ServiceDoc {
  slug: string
  image?: string
  content: { en: LocaleContent; ne?: Partial<LocaleContent> }
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
}

function pick(svc: ServiceDoc, lang: string): LocaleContent {
  const ne = svc.content.ne
  const en = svc.content.en
  if (lang === "ne" && ne) {
    return {
      name:     ne.name     || en.name,
      tag:      ne.tag      || en.tag,
      headline: ne.headline || en.headline,
      intro:    ne.intro    || en.intro,
      duration: ne.duration || en.duration,
      format:   ne.format   || en.format,
      price:    ne.price    || en.price,
      followup: ne.followup || en.followup,
      included: ne.included?.length ? ne.included : en.included,
      steps:    ne.steps?.length    ? ne.steps    : en.steps,
    }
  }
  return en
}

export function ServiceDetailClient({ svc }: { svc: ServiceDoc }) {
  const { t, lang } = useLang()
  const c = pick(svc, lang)

  return (
    <div data-lang={lang} style={{ minHeight: "100vh", background: "var(--color-bg)", overflowX: "hidden" }}>
      <Nav />

      {/* HERO */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 28px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/#services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "var(--color-text-muted)",
              fontSize: 14.5,
              fontWeight: 600,
              marginBottom: 24,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-brand)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
          >
            <ArrowLeft size={17} strokeWidth={2.2} />
            {t.all_services}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }}>
          {/* Left */}
          <div style={{ animation: "fadeUp 0.6s ease both" }}>
            <span
              style={{
                display: "inline-block",
                padding: "7px 16px",
                borderRadius: 999,
                background: "var(--color-surface)",
                color: "var(--color-brand)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.02em",
                marginBottom: 20,
              }}
            >
              {c.tag}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading), serif",
                fontWeight: 500,
                fontSize: "clamp(34px,4.6vw,56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 18px",
                color: "var(--color-text)",
              }}
            >
              {c.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(19px,2vw,23px)",
                fontStyle: "italic",
                lineHeight: 1.4,
                color: "var(--color-brand)",
                margin: "0 0 18px",
              }}
            >
              {c.headline}
            </p>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.65,
                color: "var(--color-text-muted)",
                maxWidth: 520,
                margin: "0 0 30px",
              }}
            >
              {c.intro}
            </p>
            <Link
              href="/#booking"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                padding: "6px 6px 6px 28px",
                borderRadius: 999,
                background: "var(--color-brand)",
                whiteSpace: "nowrap",
              }}
            >
              {t.book_service}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  marginLeft: 16,
                }}
              >
                <ArrowRight size={18} strokeWidth={2.2} color="#fff" />
              </span>
            </Link>
          </div>

          {/* Right: image */}
          <div style={{ position: "relative", animation: "fadeUp 0.75s ease both" }}>
            <div
              style={{
                position: "absolute",
                inset: -16,
                borderRadius: 32,
                background: "var(--color-surface)",
                opacity: 0.5,
                filter: "blur(20px)",
              }}
            />
            <div
              style={{
                position: "relative",
                aspectRatio: "5/4",
                borderRadius: 26,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 36px 80px -40px rgba(23,42,58,0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={svc.image ?? svc.ogImage}
                alt={c.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 28px 30px" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(26px,3vw,36px)",
            letterSpacing: "-0.02em",
            margin: "0 0 26px",
            color: "var(--color-text)",
          }}
        >
          {t.whats_included}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {c.included.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "20px 22px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(23,42,58,0.08)",
                boxShadow: "0 14px 40px -28px rgba(23,42,58,0.25)",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--color-brand)",
                }}
              >
                <Check size={17} strokeWidth={2.4} color="#fff" />
              </span>
              <span
                style={{
                  fontSize: 15.5,
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: "var(--color-text)",
                  paddingTop: 3,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 28px" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontWeight: 500,
            fontSize: "clamp(26px,3vw,36px)",
            letterSpacing: "-0.02em",
            margin: "0 0 30px",
            color: "var(--color-text)",
          }}
        >
          {t.what_expect}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {c.steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: "28px 26px",
                borderRadius: 22,
                background: "var(--color-surface)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: 34,
                  fontWeight: 500,
                  color: "var(--color-brand)",
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "var(--color-text)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--color-text-muted)", margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILS */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 28px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {([
            [t.l_duration, c.duration],
            [t.l_format,   c.format],
            [t.l_fee,      c.price],
            [t.l_followup, c.followup],
          ] as [string, string][]).map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "22px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(23,42,58,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ maxWidth: 1180, margin: "0 auto 64px", padding: "0 28px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            padding: "54px 44px",
            textAlign: "center",
            background: "var(--color-brand)",
            boxShadow: "0 30px 70px -34px rgba(23,42,58,0.45)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -20,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              animation: "floatA 12s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: -10,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }}
          />
          <h2
            style={{
              position: "relative",
              fontFamily: "var(--font-heading), serif",
              fontWeight: 500,
              fontSize: "clamp(28px,3.4vw,40px)",
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            {t.ready_head}
          </h2>
          <p
            style={{
              position: "relative",
              fontSize: 17,
              color: "rgba(255,255,255,0.9)",
              margin: "0 auto 28px",
              maxWidth: 460,
            }}
          >
            {t.ready_intro}
          </p>
          <Link
            href="/#booking"
            className="btn-primary"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 0,
              textDecoration: "none",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: 16,
              padding: "6px 6px 6px 28px",
              borderRadius: 999,
              background: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {t.book_prefix}
            {c.name}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.07)",
                marginLeft: 16,
              }}
            >
              <ArrowRight size={18} strokeWidth={2.2} color="var(--color-text)" />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
