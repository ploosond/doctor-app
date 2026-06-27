"use client"

import { useState, useRef, useEffect } from "react"
import { useLang } from "@/lib/i18n"
import { Check, ChevronRight, ChevronLeft, Clock } from "lucide-react"
import type { ServiceCardData } from "./ServicesSection"
import {
  getSlots,
  getNextAvailable,
  submitBooking,
  type PublicSlot,
} from "../actions"

const FORM_ACCENT = "var(--color-accent)"
const FORM_ACCENT_FILL = "var(--color-surface)"

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function dateParts(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const SLOTS_PREVIEW = 14

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--color-accent)",
  fontSize: 16,
  color: "var(--color-text)",
  boxSizing: "border-box" as const,
  fontFamily: "var(--font-sans), sans-serif",
  background: "#fff",
}

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text)",
  marginBottom: 6,
}

const primaryBtn = {
  width: "100%",
  padding: "15px",
  borderRadius: 14,
  background: FORM_ACCENT,
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
}

export function BookingSection({ services }: { services: ServiceCardData[] }) {
  const { t, lang } = useLang()
  const b = t.booking

  const [step, setStep] = useState(1)
  const [service, setService] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [windowStart, setWindowStart] = useState<string>(todayISO())
  const [showAllSlots, setShowAllSlots] = useState(false)
  const [slots, setSlots] = useState<PublicSlot[]>([])
  const [slot, setSlot] = useState<PublicSlot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [noAvailability, setNoAvailability] = useState(false) // no enabled days / nothing bookable

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState("") // honeypot — real users never see/fill this
  const renderedAt = useRef(0) // form-mount time, for bot submit-timing
  useEffect(() => {
    renderedAt.current = Date.now()
  }, [])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const svcName = (s: ServiceCardData) =>
    lang === "ne" ? s.nameFallback : s.name
  const selectedService = services.find((s) => s.slug === service)

  async function onDateChange(value: string) {
    setDate(value)
    setSlot(null)
    setSlots([])
    setShowAllSlots(false)
    if (!value) return
    setLoadingSlots(true)
    try {
      setSlots(await getSlots(value))
    } finally {
      setLoadingSlots(false)
    }
  }

  // Land on the soonest day that actually has free times (today if open, else later).
  async function jumpToNextAvailable(fromISO: string) {
    setLoadingSlots(true)
    setSlot(null)
    setShowAllSlots(false)
    try {
      const res = await getNextAvailable(fromISO)
      if (res) {
        setNoAvailability(false)
        setWindowStart(res.dateISO)
        setDate(res.dateISO)
        setSlots(res.slots)
      } else {
        // No enabled days / nothing bookable within the window.
        setNoAvailability(true)
        setDate("")
        setSlots([])
      }
    } finally {
      setLoadingSlots(false)
    }
  }

  function goToStep2() {
    setError(null)
    setStep(2)
    jumpToNextAvailable(todayISO())
  }

  async function onSubmit() {
    if (!name.trim() || !phone.trim() || !consent || !slot) {
      setError(b.required)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitBooking({
        name,
        phone,
        email,
        service,
        reason,
        slotStartISO: slot.startISO,
        slotEndISO: slot.endISO,
        consent,
        hp,
        renderedAt: renderedAt.current,
      })
      if (res.ok) {
        setStep(4)
      } else if (res.reason === "slot_taken") {
        setError(b.slot_taken)
        setSlot(null)
        setStep(2)
        if (date) await onDateChange(date)
      } else if (res.reason === "rate_limited") {
        setError(b.rate_limited)
      } else {
        setError(b.required)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function resetAll() {
    setStep(1)
    setService("")
    setDate("")
    setSlots([])
    setSlot(null)
    setName("")
    setPhone("")
    setEmail("")
    setReason("")
    setConsent(false)
    setHp("")
    setNoAvailability(false)
    setError(null)
  }

  // Step navigation (shared header arrows + bottom primary button)
  const canForward =
    (step === 1 && !!service) || (step === 2 && !!slot) || step === 3
  function forward() {
    if (step === 1 && service) goToStep2()
    else if (step === 2 && slot) {
      setError(null)
      setStep(3)
    } else if (step === 3) onSubmit()
  }
  function back() {
    if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
  }

  // Compact summary of what's chosen so far (shown on step 3)
  const summaryBits = [
    selectedService ? svcName(selectedService) : null,
    slot ? `${date} · ${slot.label}` : date || null,
  ].filter(Boolean) as string[]

  // Date & time helpers
  const today = todayISO()
  const stripDays = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(windowStart, i))
  const prevDisabled = windowStart <= today
  const monthYear = dateParts(windowStart).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })
  const visibleSlots = showAllSlots ? slots : slots.slice(0, SLOTS_PREVIEW)
  const remainingSlots = slots.length - visibleSlots.length
  const dayName = (iso: string) => {
    if (iso === today) return b.today
    if (iso === addDays(today, 1)) return b.tomorrow
    return dateParts(iso).toLocaleDateString("en-GB", { weekday: "short" })
  }
  const selectedDateLabel = date
    ? dateParts(date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : ""

  const primaryLabel =
    step === 3 ? (submitting ? b.submitting : b.submit) : b.next

  return (
    <section
      id='booking'
      className='section-container'
      style={{
        paddingTop: "clamp(36px,8vw,70px)",
        paddingBottom: "clamp(30px,8vw,60px)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontWeight: 500,
              fontSize: "clamp(30px,3.8vw,44px)",
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              lineHeight: 1.06,
              color: "var(--color-text)",
            }}
          >
            {t.book_pre}
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              {t.book_em}
            </em>
            {t.book_post}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-muted)",
              margin: "0 auto",
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            {t.book_intro}
          </p>
        </div>

        <div className='booking-grid'>
          {/* Left — image panel (placeholder) */}
          <div
            className='booking-img'
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 40px 90px -50px rgba(23,42,58,0.4)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/booking/booking.jpeg"}
              alt=''
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(23,42,58,0.78) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "clamp(20px,3vw,30px)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: 8,
                }}
              >
                {b.panel_caption}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontWeight: 500,
                  fontSize: "clamp(22px,2.4vw,28px)",
                  lineHeight: 1.12,
                  color: "#fff",
                }}
              >
                {b.panel_title}
              </div>
            </div>
          </div>

          {/* Right — wizard */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Shared header: title + progress + nav arrows */}
            {step < 4 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 22,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontWeight: 500,
                    fontSize: "clamp(22px,2.4vw,28px)",
                    letterSpacing: "-0.01em",
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {b.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        style={{
                          width: 26,
                          height: 6,
                          borderRadius: 999,
                          background:
                            n <= step ? FORM_ACCENT : "var(--color-surface)",
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type='button'
                      aria-label='Back'
                      disabled={step === 1}
                      onClick={back}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: step === 1 ? "not-allowed" : "pointer",
                        opacity: step === 1 ? 0.3 : 1,
                        color: FORM_ACCENT,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type='button'
                      aria-label='Forward'
                      disabled={!canForward}
                      onClick={forward}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: canForward ? "pointer" : "not-allowed",
                        opacity: canForward ? 1 : 0.3,
                        color: FORM_ACCENT,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — service */}
            {step === 1 && (
              <div>
                <div style={{ ...labelStyle, marginBottom: 12 }}>
                  {b.choose_service}
                </div>
                {services.length === 0 ? (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    {b.services_unavailable}{" "}
                    <a
                      href='#contact'
                      style={{ color: FORM_ACCENT, fontWeight: 600 }}
                    >
                      {t.call_today}
                    </a>
                  </p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {services.map((s) => {
                      const selected = service === s.slug
                      return (
                        <button
                          key={s.slug}
                          type='button'
                          onClick={() => setService(s.slug)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            minHeight: 64,
                            padding: "16px 18px",
                            borderRadius: 14,
                            border: `${selected ? 2 : 1.5}px solid ${selected ? FORM_ACCENT : "var(--color-accent)"}`,
                            background: selected ? FORM_ACCENT_FILL : "#fff",
                            boxShadow: selected
                              ? `0 0 0 3px ${FORM_ACCENT_FILL}`
                              : "none",
                            cursor: "pointer",
                            fontSize: 15.5,
                            fontWeight: 700,
                            lineHeight: 1.25,
                            color: "var(--color-text)",
                          }}
                        >
                          {svcName(s)}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — date & slot */}
            {step === 2 && (
              <div>
                {noAvailability ? (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    {b.no_availability}{" "}
                    <a
                      href='#contact'
                      style={{ color: FORM_ACCENT, fontWeight: 600 }}
                    >
                      {t.call_today}
                    </a>
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 14,
                      }}
                    >
                      <div style={labelStyle}>{b.select_datetime}</div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--color-text)",
                        }}
                      >
                        {monthYear}
                      </span>
                    </div>

                    {/* Day strip */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "stretch",
                        gap: 4,
                        marginBottom: 18,
                      }}
                    >
                      <button
                        type='button'
                        aria-label='Previous week'
                        disabled={prevDisabled}
                        onClick={() => setWindowStart(addDays(windowStart, -7))}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: prevDisabled ? "not-allowed" : "pointer",
                          opacity: prevDisabled ? 0.35 : 1,
                          color: "var(--color-text-muted)",
                          padding: "0 2px",
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div
                        style={{
                          flex: 1,
                          display: "grid",
                          gridTemplateColumns: "repeat(7, 1fr)",
                          gap: 2,
                        }}
                      >
                        {stripDays.map((iso) => {
                          const isActive = iso === date
                          const isPast = iso < today
                          return (
                            <button
                              key={iso}
                              type='button'
                              disabled={isPast}
                              onClick={() => !isPast && onDateChange(iso)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                padding: "8px 2px 10px",
                                background: "none",
                                border: "none",
                                borderBottom: `2px solid ${isActive ? FORM_ACCENT : "transparent"}`,
                                cursor: isPast ? "not-allowed" : "pointer",
                                opacity: isPast ? 0.3 : 1,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: isActive
                                    ? "var(--color-text)"
                                    : "var(--color-text-muted)",
                                }}
                              >
                                {dayName(iso)}
                              </span>
                              <span
                                style={{
                                  fontSize: 20,
                                  fontWeight: isActive ? 800 : 600,
                                  color: isActive
                                    ? "var(--color-text)"
                                    : "var(--color-text-muted)",
                                }}
                              >
                                {dateParts(iso).getDate()}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <button
                        type='button'
                        aria-label='Next week'
                        onClick={() => setWindowStart(addDays(windowStart, 7))}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-text-muted)",
                          padding: "0 2px",
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {error && (
                      <p
                        style={{
                          color: "#c0392b",
                          fontSize: 14,
                          margin: "0 0 12px",
                        }}
                      >
                        {error}
                      </p>
                    )}

                    {/* Time grid */}
                    {loadingSlots ? (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: 15,
                          margin: 0,
                        }}
                      >
                        {b.loading_slots}
                      </p>
                    ) : slots.length === 0 ? (
                      <div>
                        <p
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: 15,
                            margin: "0 0 10px",
                          }}
                        >
                          {b.no_slots_day}
                        </p>
                        <button
                          type='button'
                          onClick={() => jumpToNextAvailable(addDays(date, 1))}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: 15,
                            fontWeight: 700,
                            color: FORM_ACCENT,
                          }}
                        >
                          {b.next_available} →
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(84px, 1fr))",
                            gap: 10,
                          }}
                        >
                          {visibleSlots.map((s) => {
                            const selected = slot?.startISO === s.startISO
                            return (
                              <button
                                key={s.startISO}
                                type='button'
                                onClick={() => setSlot(s)}
                                style={{
                                  padding: "12px 8px",
                                  borderRadius: 12,
                                  border: `1.5px solid ${selected ? FORM_ACCENT : "var(--color-accent)"}`,
                                  background: selected ? FORM_ACCENT : "#fff",
                                  color: selected
                                    ? "#fff"
                                    : "var(--color-text)",
                                  fontSize: 15,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                {s.startLabel}
                              </button>
                            )
                          })}
                        </div>
                        {remainingSlots > 0 && (
                          <button
                            type='button'
                            onClick={() => setShowAllSlots(true)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "14px 0 0",
                              cursor: "pointer",
                              fontSize: 15,
                              fontWeight: 700,
                              color: FORM_ACCENT,
                            }}
                          >
                            {b.show_more}{" "}
                            <span
                              style={{
                                color: "var(--color-text-muted)",
                                fontWeight: 500,
                              }}
                            >
                              ({remainingSlots} {b.available})
                            </span>
                          </button>
                        )}
                      </>
                    )}

                    {/* Selected banner */}
                    {slot && (
                      <div
                        style={{
                          marginTop: 20,
                          padding: "16px 20px",
                          borderRadius: 16,
                          background: `linear-gradient(120deg, var(--color-surface), ${FORM_ACCENT_FILL})`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            color: "var(--color-text-muted)",
                            marginBottom: 6,
                          }}
                        >
                          {b.selected}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Clock size={18} color={FORM_ACCENT} />
                          <span
                            style={{
                              fontSize: 17,
                              fontWeight: 700,
                              color: "var(--color-text)",
                            }}
                          >
                            {selectedDateLabel}, {slot.startLabel} -{" "}
                            {slot.endLabel}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 3 — details */}
            {step === 3 && (
              <div>
                {summaryBits.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 18,
                    }}
                  >
                    {summaryBits.map((bit) => (
                      <span
                        key={bit}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 999,
                          background: FORM_ACCENT_FILL,
                          color: "var(--color-text)",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {/* Honeypot — off-screen (not display:none, which bots skip).
                      Real users never see or fill it; a non-empty value = bot. */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label>
                      Company
                      <input
                        type='text'
                        name='company'
                        tabIndex={-1}
                        autoComplete='off'
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                      />
                    </label>
                  </div>
                  <div>
                    <label style={labelStyle}>{b.name_label}</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={b.name_ph}
                      style={inputStyle}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>{b.phone_label}</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={b.phone_ph}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{b.email_label}</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={b.email_ph}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>{b.reason_label}</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder={b.reason_ph}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                  <label
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      fontSize: 15,
                      color: "var(--color-text)",
                      lineHeight: 1.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      style={{
                        width: 16,
                        height: 16,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    />
                    {b.consent_label}
                  </label>
                </div>

                {error && (
                  <p
                    style={{
                      color: "#c0392b",
                      fontSize: 14,
                      margin: "14px 0 0",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Step 4 — success */}
            {step === 4 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: FORM_ACCENT,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Check size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: 26,
                    fontWeight: 500,
                    color: "var(--color-text)",
                    margin: "0 0 12px",
                  }}
                >
                  {b.success_title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--color-text-muted)",
                    margin: "0 auto 24px",
                    maxWidth: 420,
                    lineHeight: 1.6,
                  }}
                >
                  {b.success_msg}
                </p>
                <button
                  type='button'
                  onClick={resetAll}
                  style={{
                    ...primaryBtn,
                    width: "auto",
                    display: "inline-block",
                    padding: "13px 28px",
                  }}
                >
                  {b.success_again}
                </button>
              </div>
            )}

            {/* Bottom primary action */}
            {step < 4 && (
              <div style={{ marginTop: "auto", paddingTop: 28 }}>
                <button
                  type='button'
                  disabled={!canForward || submitting}
                  onClick={forward}
                  style={{
                    ...primaryBtn,
                    opacity: !canForward || submitting ? 0.5 : 1,
                    cursor:
                      !canForward || submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {primaryLabel}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Crisis notice */}
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            margin: "16px 0 0",
            padding: "12px 16px",
            borderRadius: 12,
            background: "var(--color-surface)",
            lineHeight: 1.5,
          }}
        >
          {b.crisis}
        </p>
      </div>
    </section>
  )
}
