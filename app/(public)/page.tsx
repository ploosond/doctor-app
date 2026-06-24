export const revalidate = 3600 // ISR — regenerate hourly; first build can't reach private-VPC Mongo

import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { Nav } from "./Nav";
import { HeroSection } from "./HeroSection";
import { TrustStatsSection } from "./TrustStatsSection";
import { ServicesSection, type ServiceCardData } from "./ServicesSection";
import { AboutSection } from "./AboutSection";
import { CareJourneySection } from "./CareJourneySection";
import { BookingSection } from "./BookingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
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
    await connectDB()
    const docs = (await ServiceModel.find(
      { visible: true },
      { slug: 1, image: 1, "content.en.name": 1, "content.en.tag": 1, "content.ne.name": 1, "content.ne.tag": 1 }
    ).lean()) as unknown as ServiceDoc[]
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
      <Reveal><BookingSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <Footer />
    </main>
  );
}
