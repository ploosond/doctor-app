import type { Metadata } from "next"
import { LegalDoc, type LegalSection } from "@/app/(public)/components/LegalDoc"

export const metadata: Metadata = {
  title: "Privacy Policy — Dr. Lila",
  description:
    "How Dr. Lila's psychiatry clinic collects, uses, and protects your personal and health information.",
}

// NOTE: clinic name, address, registration and contact details below are PLACEHOLDERS — replace before launch.
const CLINIC = "Dr. Lila's Psychiatry Clinic"
const CONTACT_EMAIL = "privacy@drlila.example" // placeholder
const CONTACT_PHONE = "+977-1-XXXXXXX" // placeholder

const sections: LegalSection[] = [
  {
    h: "Who we are",
    p: [
      `${CLINIC} ("we", "us", "the clinic") provides outpatient psychiatric consultation and related mental-health services in Nepal. Our practitioners are registered with the Nepal Medical Council (NMC) and bound by its professional and ethical standards.`,
      `This policy explains how we handle your information when you visit this website, request an appointment, or receive care from us. For privacy questions, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    ],
  },
  {
    h: "Information we collect",
    p: [
      "Booking details you provide: your name, phone number, optional email address, and an optional short reason for your visit.",
      "Clinical information created during care: appointment dates, consultation/visit notes, working diagnosis, medications, follow-up dates, and any allergy or risk alerts recorded by the clinician.",
      "We do not collect payment-card information through this website; we do not process online payments.",
      "We keep third-party analytics and trackers to a minimum, particularly on pages that describe symptoms or conditions.",
    ],
  },
  {
    h: "How we use your information",
    p: [
      "To schedule, confirm, reschedule, or cancel your appointment, and to contact you about your care.",
      "To maintain your clinical record so the doctor can provide safe, continuous treatment.",
      "To send appointment-related notifications by email where you have provided an email address. Notification wording is kept discreet.",
    ],
  },
  {
    h: "Consent and lawful basis",
    p: [
      "When you submit a booking you confirm your consent for us to store and use these details to manage your appointment and care.",
      "Health information is sensitive. We process it to provide medical services to you and in line with the confidentiality duties of registered medical practitioners in Nepal. You may withdraw consent for non-essential processing at any time by contacting us; some records may be retained where professionally or legally required.",
    ],
  },
  {
    h: "Medical confidentiality",
    p: [
      "Your consultations and clinical records are confidential. Access is limited to the treating clinician and authorised clinic staff who need it to provide your care.",
      "We will not disclose your information to third parties except with your consent, or where required to protect your or others' safety, or where compelled by law.",
    ],
  },
  {
    h: "Storage, security and service providers",
    p: [
      "Records are stored in a secured database with access controls. We use reputable service providers strictly to operate the clinic: a managed database for records, a transactional email provider to send appointment notifications, and an image/media service for website content.",
      "These providers process data on our behalf under their own security and privacy commitments. We apply encryption in transit and reasonable safeguards against unauthorised access.",
    ],
  },
  {
    h: "Retention",
    p: [
      "We keep clinical records for as long as needed to provide ongoing care and to meet professional record-keeping expectations for medical practitioners in Nepal. When information is no longer required, it is deleted or de-identified.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You may ask to access, correct, or update your personal information, and request deletion where retention is not professionally or legally required. To make a request, contact us using the details above. We may verify your identity before acting.",
    ],
  },
  {
    h: "Crisis notice — this site is not for emergencies",
    p: [
      "This website and its booking form are not monitored in real time and must not be used for medical emergencies or crises.",
      "If you or someone else is in danger or experiencing a mental-health emergency, contact your nearest emergency service or a national mental-health / suicide-prevention helpline immediately. (Helpline number: TO BE CONFIRMED before launch.)",
    ],
  },
  {
    h: "Changes to this policy",
    p: [
      "We may update this policy from time to time. Material changes will be reflected on this page with a revised date.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="Last updated: [DATE — set before launch]"
      intro="Your privacy and the confidentiality of your health information matter to us. This policy describes what we collect, why, and the choices you have."
      sections={sections}
    />
  )
}
