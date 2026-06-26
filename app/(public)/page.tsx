export const revalidate = 3600 // ISR — regenerate hourly; first build can't reach private-VPC Mongo

import { listServices } from "@/lib/services/catalog"
import { Nav } from "./components/Nav";
import { HeroSection } from "./components/HeroSection";
import { TrustStatsSection } from "./components/TrustStatsSection";
import { ServicesSection, type ServiceCardData } from "./components/ServicesSection";
import { AboutSection } from "./components/AboutSection";
import { CareJourneySection } from "./components/CareJourneySection";
import { BookingSection } from "./components/BookingSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Reveal } from "@/components/Reveal";

type ServiceDoc = {
  slug: string
  image?: string
  content: {
    en: { name?: string; tag?: string }
    ne?: { name?: string; tag?: string }
  }
}

async function getVisibleServices(): Promise<ServiceCardData[]> {
  try {
    const docs = (await listServices({ visibleOnly: true })) as unknown as ServiceDoc[]
    return docs.map((s) => {
      const en = s.content?.en ?? {}
      const ne = s.content?.ne ?? {}
      return {
        slug:         s.slug,
        image:        s.image,
        name:         en.name ?? "",
        tag:          en.tag  ?? "",
        nameFallback: ne.name || en.name || "",
        tagFallback:  ne.tag  || en.tag  || "",
      }
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const services = await getVisibleServices()

  return (
    <main>
      <Nav />
      <HeroSection />
      <Reveal><TrustStatsSection /></Reveal>
      <ServicesSection services={services} />
      <Reveal><AboutSection /></Reveal>
      <CareJourneySection />
      <Reveal><BookingSection services={services} /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <Footer />
    </main>
  );
}
