"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";
import { demoImage } from "@/lib/demo-image";

const CAROUSEL_SLIDES = [
  { label: "Dr. Lila — consultations",                 img: "samples/people/smiling-man" },
  { label: "Clinical environment — privacy & comfort", img: "samples/landscapes/girl-urban-view" },
  { label: "Evidence-based care — therapy",            img: "samples/people/kitchen-bar" },
  { label: "Medication management — personalized",     img: "samples/landscapes/beach-boat" },
  { label: "Follow-up support — ongoing wellness",     img: "samples/landscapes/nature-mountains" },
];

export function HeroSection() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  const next = useCallback(
    () => setIdx((i) => (i + 1) % CAROUSEL_SLIDES.length),
    []
  );
  const prev = useCallback(
    () =>
      setIdx((i) => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length),
    []
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const pct = `${((idx + 1) / CAROUSEL_SLIDES.length) * 100}%`;

  return (
    <section
      id="top"
      className="hero-shell"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Carousel backgrounds */}
      {CAROUSEL_SLIDES.map(({ img }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 0.6s ease",
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={demoImage(img, 1440, 900)}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg,rgba(23,42,58,0.55) 0%,rgba(23,42,58,0.22) 40%,transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Text overlay */}
      <div
        className="hero-text-panel"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading), Georgia, serif",
            fontWeight: 500,
            fontSize: "clamp(40px,5.4vw,68px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: "0 0 22px",
            textWrap: "balance",
            color: "#fff",
          }}
        >
          {t.hero_pre}
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>{t.hero_em}</em>
          {t.hero_post}
        </h1>
        <p
          style={{
            fontSize: "clamp(15px,4vw,18px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.9)",
            maxWidth: "clamp(280px,90vw,480px)",
            margin: "0 0 32px",
          }}
        >
          {t.hero_sub}
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a
            href="#booking"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: "clamp(14px,3.5vw,16px)",
              padding: "6px 6px 6px clamp(18px,4vw,28px)",
              borderRadius: 999,
              background: "var(--color-brand)",
            }}
          >
            {t.nav_book}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#fff",
                marginLeft: 16,
              }}
            >
              <ArrowRight size={18} strokeWidth={2.4} color="var(--color-brand)" />
            </span>
          </a>
          <a
            href="#services"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: "clamp(14px,3.5vw,16px)",
              padding: "6px 6px 6px clamp(18px,4vw,28px)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            {t.hero_explore}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                marginLeft: 16,
              }}
            >
              <ArrowRight size={18} strokeWidth={2.4} color="#fff" />
            </span>
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="hero-progress"
        style={{
          position: "absolute",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 2,
            height: 120,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: pct,
              background: "rgba(255,255,255,0.7)",
              transition: "height 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Nav arrows */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          zIndex: 10,
          display: "flex",
          gap: 12,
        }}
      >
        {[prev, next].map((fn, i) => (
          <button
            key={i}
            onClick={fn}
            style={{
              width: "clamp(34px,8vw,40px)",
              height: "clamp(34px,8vw,40px)",
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.2)";
              el.style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {i === 0 ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}
