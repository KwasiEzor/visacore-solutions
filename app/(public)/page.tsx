import { prisma } from "@/lib/prisma";
import { getHomePageContent } from "@/lib/page-content";
import { buildHomePageContent } from "@/lib/page-content.shared";
import {
  fallbackDestinations,
  fallbackServices,
  fallbackTestimonials,
  getDestinationVisual,
} from "@/lib/public-content";

import { HeroSection } from "@/components/public/home/hero-section";
import { TrustStripSection } from "@/components/public/home/trust-strip-section";
import { DestinationsSection } from "@/components/public/home/destinations-section";
import { ServicesSection } from "@/components/public/home/services-section";
import { WhyUsSection } from "@/components/public/home/why-us-section";
import { ProcessSection } from "@/components/public/home/process-section";
import { TestimonialsSection } from "@/components/public/home/testimonials-section";
import { CtaSection } from "@/components/public/home/cta-section";

export const revalidate = 3600;

export default async function HomePage() {
  const pageContentPromise = getHomePageContent();
  let pageContent = buildHomePageContent([]);
  let destinations = fallbackDestinations;
  let services = fallbackServices;
  let testimonials = fallbackTestimonials;

  try {
    const [resolvedPageContent, dbDestinations, dbServices, dbTestimonials] =
      await Promise.all([
        pageContentPromise,
        prisma.destination.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
          take: 3,
          select: {
            slug: true,
            name: true,
            heroTitle: true,
            heroDescription: true,
          },
        }),
        prisma.service.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
          take: 4,
          select: {
            slug: true,
            name: true,
            icon: true,
            description: true,
          },
        }),
        prisma.testimonial.findMany({
          where: { published: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 2,
          select: {
            id: true,
            clientName: true,
            destination: true,
            content: true,
            rating: true,
          },
        }),
      ]);

    pageContent = resolvedPageContent;

    if (dbDestinations.length > 0) {
      destinations = dbDestinations.map((destination) => ({
        slug: destination.slug,
        name: destination.name,
        heroTitle: destination.heroTitle,
        heroDescription: destination.heroDescription || "",
        ...getDestinationVisual(destination.slug),
      }));
    }

    if (dbServices.length > 0) {
      services = dbServices.map((service) => ({
        slug: service.slug,
        name: service.name,
        icon: service.icon || "Globe",
        description: service.description || "",
      }));
    }

    if (dbTestimonials.length > 0) {
      testimonials = dbTestimonials.map((testimonial) => ({
        ...testimonial,
        destination: testimonial.destination || "Internationale",
      }));
    }
  } catch {
    // Fall back to static content when database reads are unavailable.
  }

  return (
    <div className="relative overflow-x-clip">
      <HeroSection pageContent={pageContent} />
      <TrustStripSection />

      <div className="deferred-section">
        <DestinationsSection destinations={destinations} />
      </div>
      <div className="deferred-section">
        <ServicesSection services={services} />
      </div>
      <div className="deferred-section">
        <WhyUsSection />
      </div>
      <div className="deferred-section">
        <ProcessSection />
      </div>
      <div className="deferred-section">
        <TestimonialsSection testimonials={testimonials} />
      </div>
      <div className="deferred-section">
        <CtaSection />
      </div>
    </div>
  );
}
