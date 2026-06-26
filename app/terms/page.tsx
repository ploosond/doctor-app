import type { Metadata } from "next"
import { LegalDoc, type LegalSection } from "@/app/(public)/components/LegalDoc"

export const metadata: Metadata = {
  title: "Terms of Service — Dr. Lila",
  description: "The terms governing your use of Dr. Lila's clinic website and appointment booking.",
}

// NOTE: clinic identity and contact details are PLACEHOLDERS — replace before launch.
const CLINIC = "Dr. Lila's Psychiatry Clinic"

const sections: LegalSection[] = [
  {
    h: "About these terms",
    p: [
      `These Terms of Service govern your use of the ${CLINIC} website and its online appointment-request feature. By using this website you agree to these terms. If you do not agree, please do not use the site.`,
    ],
  },
  {
    h: "No medical advice through this website",
    p: [
      "Information on this website is for general information only and is not medical advice, diagnosis, or treatment. It is not a substitute for a consultation with a qualified clinician.",
      "A clinician–patient relationship is formed only through an actual consultation, not by browsing the site or submitting a booking request.",
    ],
  },
  {
    h: "Appointment requests",
    p: [
      "Submitting the booking form creates a request only. An appointment is not confirmed until the clinic confirms it with you. We may decline or propose an alternative time where necessary.",
      "Please provide accurate contact details. We are not responsible for missed appointments caused by incorrect information or unreachable contact details.",
    ],
  },
  {
    h: "Cancellation and rescheduling",
    p: [
      "If you cannot attend, please contact the clinic as early as possible so the slot can be offered to another patient. The clinic may reschedule or cancel appointments where required and will make reasonable efforts to inform you.",
    ],
  },
  {
    h: "Payments",
    p: [
      "No payment is collected through this website. Any consultation fees are handled directly with the clinic.",
    ],
  },
  {
    h: "Emergencies",
    p: [
      "This website is not for emergencies and is not monitored in real time. In a medical or mental-health emergency, contact your nearest emergency service or a national helpline immediately.",
    ],
  },
  {
    h: "Professional standards",
    p: [
      "Our clinicians are registered with the Nepal Medical Council and provide care in accordance with its professional and ethical standards and applicable Nepali law.",
    ],
  },
  {
    h: "Intellectual property",
    p: [
      "The content, branding, and design of this website belong to the clinic and may not be copied or reused without permission.",
    ],
  },
  {
    h: "Limitation of liability",
    p: [
      "To the extent permitted by law, the clinic is not liable for indirect or consequential loss arising from use of this website. Nothing in these terms limits liability that cannot be excluded under applicable law.",
    ],
  },
  {
    h: "Governing law",
    p: [
      "These terms are governed by the laws of Nepal, and any disputes are subject to the jurisdiction of the courts of Nepal.",
    ],
  },
  {
    h: "Changes",
    p: [
      "We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.",
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="Last updated: [DATE — set before launch]"
      intro="Please read these terms carefully before using this website or requesting an appointment."
      sections={sections}
    />
  )
}
