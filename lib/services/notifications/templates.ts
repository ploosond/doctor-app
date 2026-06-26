// Internal — do not import directly. Use the public API in ./index.ts.

const CLINIC = "Dr. Lila's clinic"

export function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-GB", {
    timeZone: "Asia/Kathmandu",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function fmtTime(d: Date): string {
  return new Date(d).toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ---- Patient message lines (discreet, bilingual EN + NE; signature added by emailPatient) ----

export function msgNewRequestPatient(): string {
  return (
    `Your appointment request has been received. We'll confirm shortly.\n` +
    `तपाईंको अपोइन्टमेन्ट अनुरोध प्राप्त भयो। हामी छिट्टै पुष्टि गर्नेछौं।`
  )
}

export function msgConfirmed(slotStart: Date): string {
  const date = fmtDate(slotStart)
  const time = fmtTime(slotStart)
  return (
    `Your appointment is confirmed for ${date}, ${time}.\n` +
    `तपाईंको अपोइन्टमेन्ट ${date}, ${time} मा पुष्टि भयो।`
  )
}

export function msgCancelled(slotStart: Date): string {
  const date = fmtDate(slotStart)
  return (
    `Your appointment on ${date} has been cancelled. Please contact us to rebook.\n` +
    `${date} को तपाईंको अपोइन्टमेन्ट रद्द गरियो। पुनः बुक गर्न हामीलाई सम्पर्क गर्नुहोस्।`
  )
}

// ---- Clinic email (internal, may include detail) ----

export function emailNewRequestClinic(args: {
  name: string
  phone: string
  service: string
  slotStart: Date
  reason?: string
}): { subject: string; html: string } {
  const { name, phone, service, slotStart, reason } = args
  const when = `${fmtDate(slotStart)}, ${fmtTime(slotStart)}`
  return {
    subject: `New appointment request — ${name}`,
    html:
      `<h2>New appointment request</h2>` +
      `<p><strong>Patient:</strong> ${name}<br/>` +
      `<strong>Phone:</strong> ${phone}<br/>` +
      `<strong>Service:</strong> ${service}<br/>` +
      `<strong>When:</strong> ${when}</p>` +
      (reason ? `<p><strong>Note:</strong> ${reason}</p>` : "") +
      `<p>Open the admin panel to confirm or reschedule.</p>`,
  }
}

// ---- Patient email (discreet) ----

export function emailPatient(subject: string, line: string): { subject: string; html: string } {
  return {
    subject,
    html: `<p>${line.replace(/\n/g, "<br/>")}</p><p>— ${CLINIC}</p>`,
  }
}

// ---- Auth emails (admin account recovery / verification) ----

export function emailResetPassword(url: string): { subject: string; html: string } {
  return {
    subject: `Reset your ${CLINIC} password`,
    html:
      `<h2>Reset your password</h2>` +
      `<p>We received a request to reset the password for your ${CLINIC} admin account.</p>` +
      `<p><a href="${url}">Set a new password</a></p>` +
      `<p>If you didn't request this, you can safely ignore this email.</p>`,
  }
}

export function emailVerify(url: string): { subject: string; html: string } {
  return {
    subject: `Verify your ${CLINIC} email`,
    html:
      `<h2>Verify your email</h2>` +
      `<p>Confirm this address to finish setting up your ${CLINIC} admin account.</p>` +
      `<p><a href="${url}">Verify email</a></p>`,
  }
}
