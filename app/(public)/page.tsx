export const revalidate = 3600 // ISR — regenerate hourly; first build can't reach private-VPC Mongo

import { connectDB } from "@/lib/db"
import { ServiceModel } from "@/models/service"
import { Nav } from "./Nav";
import { HeroSection } from "./HeroSection";
import { TrustStatsSection } from "./TrustStatsSection";
import { ServicesSection } from "./ServicesSection";
import { AboutSection } from "./AboutSection";
import { CareJourneySection } from "./CareJourneySection";
import { BookingSection } from "./BookingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export type ServiceCard = { id: string; image?: string }

async function getServiceImages(): Promise<Record<string, string | undefined>> {
  try {
    await connectDB()
    const dbServices = await ServiceModel.find({ visible: true }, { slug: 1, image: 1 }).lean()
    return Object.fromEntries(
      dbServices.map((s) => [s.slug as string, s.image as string | undefined])
    )
  } catch {
    // build runs before Mongo is reachable — return empty, ISR fills real data at runtime
    return {}
  }
}

export default async function HomePage() {
  const serviceImages = await getServiceImages()

  return (
    <main>
      <Nav />
      <HeroSection />
      <TrustStatsSection />
      <ServicesSection serviceImages={serviceImages} />
      <AboutSection />
      <CareJourneySection />
      <BookingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
