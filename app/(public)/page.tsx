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

export default async function HomePage() {
  await connectDB()
  const dbServices = await ServiceModel.find({ visible: true }, { slug: 1, image: 1 }).lean()
  const serviceImages: Record<string, string | undefined> = Object.fromEntries(
    dbServices.map((s) => [s.slug as string, s.image as string | undefined])
  )

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
