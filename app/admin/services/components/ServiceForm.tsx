"use client"

import { useState } from "react"
import Link from "next/link"
import { SubmitButton } from "@/app/admin/components/SubmitButton"
import { cardStyle as card, inputStyle, labelStyle, sectionHeadStyle as sectionHead, primaryBtnStyle, secondaryBtnStyle } from "@/app/admin/ui"

type Lang = "en" | "ne"

type LocaleContent = {
  name: string; tag: string; headline: string; intro: string
  duration: string; format: string; price: string; followup: string
  included: string[]; steps: { title: string; desc: string }[]
}

export type ServiceDoc = {
  slug: string; image?: string; visible: boolean
  content: { en: LocaleContent; ne: LocaleContent }
  metaTitle?: string; metaDescription?: string; keywords?: string[]; ogImage?: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function LangTab({ lang, active, onClick }: { lang: Lang; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 20px",
        borderRadius: 8,
        border: "1px solid var(--admin-border)",
        background: active ? "#FAFBFC" : "#fff",
        color: active ? "var(--color-brand)" : "var(--admin-muted)",
        fontWeight: active ? 700 : 500,
        fontSize: 15,
        cursor: "pointer",
      }}
    >
      {lang === "en" ? "English" : "Nepali (नेपाली)"}
    </button>
  )
}

function LocaleFields({ lang, included, setIncluded, defaults }: {
  lang: Lang
  included: string[]
  setIncluded: (v: string[]) => void
  defaults?: LocaleContent
}) {
  const p = lang === "ne" ? "Nepali — " : ""
  return (
    <div>
      {/* Core text */}
      <div className="admin-grid-2" style={{ gap: 14, marginBottom: 14 }}>
        <Field label="Name">
          <input name={`${lang}_name`} type="text" defaultValue={defaults?.name ?? ""} placeholder={`${p}Service name`} style={inputStyle} />
        </Field>
        <Field label="Tag / badge">
          <input name={`${lang}_tag`} type="text" defaultValue={defaults?.tag ?? ""} placeholder={`${p}e.g. Consultation`} style={inputStyle} />
        </Field>
      </div>
      <Field label="Headline (italic tagline)">
        <input name={`${lang}_headline`} type="text" defaultValue={defaults?.headline ?? ""} placeholder={`${p}Short tagline shown below the title`} style={inputStyle} />
      </Field>
      <Field label="Intro paragraph">
        <textarea
          name={`${lang}_intro`}
          rows={3}
          defaultValue={defaults?.intro ?? ""}
          placeholder={`${p}2–4 sentence introduction`}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>

      {/* Operational */}
      <div className="admin-grid-2" style={{ gap: 14, marginBottom: 14 }}>
        <Field label="Duration">
          <input name={`${lang}_duration`} type="text" defaultValue={defaults?.duration ?? ""} placeholder={`${p}60 minutes`} style={inputStyle} />
        </Field>
        <Field label="Format">
          <input name={`${lang}_format`} type="text" defaultValue={defaults?.format ?? ""} placeholder={`${p}In person or online`} style={inputStyle} />
        </Field>
        <Field label="Price">
          <input name={`${lang}_price`} type="text" defaultValue={defaults?.price ?? ""} placeholder={`${p}From Rs. 2,000`} style={inputStyle} />
        </Field>
        <Field label="Follow-up">
          <input name={`${lang}_followup`} type="text" defaultValue={defaults?.followup ?? ""} placeholder={`${p}Within 1 week`} style={inputStyle} />
        </Field>
      </div>

      {/* What's included */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>What&apos;s included</div>
        {included.map((val, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              name={`included_${lang}_${i}`}
              type="text"
              defaultValue={val}
              placeholder={`${p}Item ${i + 1}`}
              style={{ ...inputStyle, flex: 1 }}
            />
            {included.length > 1 && (
              <button
                type="button"
                onClick={() => setIncluded(included.filter((_, j) => j !== i))}
                style={{
                  padding: "0 12px",
                  borderRadius: 7,
                  border: "1.5px solid rgba(192,57,43,0.3)",
                  background: "rgba(192,57,43,0.06)",
                  color: "#c0392b",
                  fontSize: 16,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIncluded([...included, ""])}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "1px solid var(--admin-border)",
            background: "#FAFBFC",
            color: "var(--color-brand)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add item
        </button>
      </div>

      {/* Steps */}
      <div style={{ ...labelStyle, marginBottom: 10 }}>What to expect (3 steps)</div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            background: "#FAFBFC",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-brand)", marginBottom: 8 }}>
            Step {i + 1}
          </div>
          <Field label="Title">
            <input
              name={`step_${lang}_${i}_title`}
              type="text"
              defaultValue={defaults?.steps?.[i]?.title ?? ""}
              placeholder={`${p}Step title`}
              style={inputStyle}
            />
          </Field>
          <Field label="Description">
            <textarea
              name={`step_${lang}_${i}_desc`}
              rows={2}
              defaultValue={defaults?.steps?.[i]?.desc ?? ""}
              placeholder={`${p}Brief description`}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
        </div>
      ))}
    </div>
  )
}

export function ServiceForm({ action, initialData }: { action: (fd: FormData) => Promise<void>; initialData?: ServiceDoc }) {
  const isEdit = !!initialData
  const [activeLang, setActiveLang] = useState<Lang>("en")
  const [enIncluded, setEnIncluded] = useState(() =>
    initialData?.content.en.included?.length ? [...initialData.content.en.included] : ["", "", "", ""]
  )
  const [neIncluded, setNeIncluded] = useState(() =>
    initialData?.content.ne.included?.length ? [...initialData.content.ne.included] : ["", "", "", ""]
  )
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDescription ?? "")
  const [preview, setPreview] = useState<string | null>(initialData?.image ?? null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <form action={action} encType="multipart/form-data">
      {/* Service image */}
      <div style={card}>
        <div style={sectionHead}>Service image</div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Preview */}
          <div
            style={{
              width: 140,
              height: 105,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid var(--admin-border)",
              background: "#FAFBFC",
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
            }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 13, color: "var(--admin-muted)" }}>No image</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Upload image</div>
            <input
              id="service-image-upload"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setPreview(URL.createObjectURL(file))
                  setFileName(file.name)
                }
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <label
                htmlFor="service-image-upload"
                style={{
                  display: "inline-block",
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "1px solid var(--admin-border)",
                  background: "#FAFBFC",
                  color: "var(--color-brand)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Choose image
              </label>
              <span style={{ fontSize: 14, color: "var(--admin-muted)" }}>
                {fileName ?? (preview ? "Current image" : "No file chosen")}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "var(--admin-muted)", margin: 0 }}>
              Recommended: 800×600 JPG/PNG, under 8MB.
            </p>
          </div>
        </div>
      </div>

      {/* Shared: slug + visibility */}
      <div style={card}>
        <div style={sectionHead}>Identifier</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "end" }}>
          <Field label="Slug (URL key)">
            <input
              name="slug"
              type="text"
              required
              readOnly={isEdit}
              defaultValue={initialData?.slug ?? ""}
              placeholder="e.g. consult"
              onBlur={(e) => {
                if (!isEdit) e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
              }}
              style={{ ...inputStyle, ...(isEdit ? { background: "#F2F4F6", color: "var(--admin-muted)" } : {}) }}
            />
          </Field>
          <div style={{ paddingBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>
              <input name="visible" type="checkbox" defaultChecked={initialData?.visible ?? true} style={{ width: 15, height: 15 }} />
              Show on public site
            </label>
          </div>
        </div>
      </div>

      {/* Language tabs */}
      <div style={card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <LangTab lang="en" active={activeLang === "en"} onClick={() => setActiveLang("en")} />
          <LangTab lang="ne" active={activeLang === "ne"} onClick={() => setActiveLang("ne")} />
        </div>

        {/* Both rendered, only one visible — so all inputs submit */}
        <div style={{ display: activeLang === "en" ? "block" : "none" }}>
          <LocaleFields lang="en" included={enIncluded} setIncluded={setEnIncluded} defaults={initialData?.content.en} />
        </div>
        <div style={{ display: activeLang === "ne" ? "block" : "none" }}>
          <LocaleFields lang="ne" included={neIncluded} setIncluded={setNeIncluded} defaults={initialData?.content.ne} />
        </div>
      </div>

      {/* SEO */}
      <div style={card}>
        <div style={sectionHead}>SEO & metadata</div>
        <Field label="Meta title">
          <input
            name="metaTitle"
            type="text"
            defaultValue={initialData?.metaTitle ?? ""}
            placeholder="Leave blank to use English service name"
            style={inputStyle}
          />
        </Field>
        <Field label={`Meta description (${metaDesc.length}/160)`}>
          <textarea
            name="metaDescription"
            rows={3}
            maxLength={160}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            placeholder="Short description shown in Google results"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
        <Field label="Keywords (comma-separated)">
          <input
            name="keywords"
            type="text"
            defaultValue={initialData?.keywords?.join(", ") ?? ""}
            placeholder="psychiatry, anxiety treatment, Kathmandu"
            style={inputStyle}
          />
        </Field>
        <Field label="OG image URL">
          <input
            name="ogImage"
            type="text"
            defaultValue={initialData?.ogImage ?? ""}
            placeholder="https://…"
            style={inputStyle}
          />
        </Field>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <SubmitButton label={isEdit ? "Update service" : "Create service"} style={primaryBtnStyle} />
        <Link href="/admin/services" style={secondaryBtnStyle}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
