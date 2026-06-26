"use client";

import { useLang } from "@/lib/i18n";
import { Phone } from "lucide-react";

export function ContactSection() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      style={{
        width: "100%",
        background: "var(--color-surface)",
        padding: "clamp(44px,10vw,80px) 0",
      }}
    >
      <div className="section-container grid-2col">
        {/* Left */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontWeight: 400,
              fontSize: "clamp(30px,3.8vw,46px)",
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}
          >
            {t.contact_head}
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "var(--color-text-muted)",
              lineHeight: 1.65,
              margin: "0 0 clamp(20px,5vw,36px)",
              maxWidth: "clamp(260px,90%,460px)",
            }}
          >
            {t.contact_intro}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="tel:+97714000000"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "clamp(12px,3vw,16px) clamp(18px,4vw,32px)",
                borderRadius: 999,
                background: "var(--color-brand)",
              }}
            >
              <Phone size={18} strokeWidth={2} />
              {t.call_today}
            </a>
            <a
              href="https://wa.me/97714000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "clamp(12px,3vw,16px) clamp(18px,4vw,32px)",
                borderRadius: 999,
                background: "#25D366",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.75c0 4.48-3.65 8.13-8.13 8.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.13 8.13 0 0 1-1.25-4.34c0-4.48 3.65-8.13 8.13-8.13Zm-2.69 4.39c-.13 0-.34.05-.52.24-.18.2-.69.68-.69 1.65 0 .97.71 1.91.81 2.04.1.13 1.39 2.12 3.37 2.97.47.2.84.32 1.12.42.47.15.9.13 1.24.08.38-.06 1.16-.47 1.32-.93.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23-.2-.1-1.16-.57-1.34-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.83-.31-1.59-.98-.59-.52-.98-1.17-1.1-1.37-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.44-1.07-.61-1.46-.16-.38-.32-.33-.44-.34-.11 0-.24-.01-.37-.01Z" />
              </svg>
              {t.whatsapp_today}
            </a>
          </div>
        </div>

        {/* Right: clinic photo */}
        <div style={{ borderRadius: 22, overflow: "hidden", aspectRatio: "4/3" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/77/600/450"
            alt="Clinic"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
