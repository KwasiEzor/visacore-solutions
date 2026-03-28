import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { DeferredChatbot } from "@/components/public/deferred-chatbot";

import { prisma } from "@/lib/prisma";
import {
  fallbackDestinations,
  fallbackServices,
  getDestinationVisual,
} from "@/lib/public-content";
import {
  getPublicChatbotSiteConfig,
  getPublicSiteConfig,
  getWhatsAppHref,
} from "@/lib/site-config";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfigPromise = getPublicSiteConfig()
  const chatbotConfigPromise = getPublicChatbotSiteConfig()
  const servicesPromise = prisma.service
    .findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
      select: {
        slug: true,
        name: true,
      },
    })
    .catch(() => [])
  const destinationsPromise = prisma.destination
    .findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
      select: {
        slug: true,
        name: true,
      },
    })
    .catch(() => [])

  const [siteConfig, chatbotConfig, services, destinations] = await Promise.all([
    siteConfigPromise,
    chatbotConfigPromise,
    servicesPromise,
    destinationsPromise,
  ])

  let navigationServices = fallbackServices.map((service) => ({
    slug: service.slug,
    name: service.name,
  }))
  let navigationDestinations = fallbackDestinations.map((destination) => ({
    slug: destination.slug,
    name: destination.name,
    flag: destination.flag,
  }))

  if (services.length > 0) {
    navigationServices = services
  }

  if (destinations.length > 0) {
    navigationDestinations = destinations.map((destination) => ({
      slug: destination.slug,
      name: destination.name,
      flag: getDestinationVisual(destination.slug).flag,
    }))
  }

  return (
    <>
      <Header
        siteConfig={siteConfig}
        services={navigationServices}
        destinations={navigationDestinations}
      />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer siteConfig={siteConfig} services={navigationServices.slice(0, 5)} />
      <WhatsAppButton
        href={
          siteConfig.whatsappEnabled
            ? getWhatsAppHref(
                siteConfig.whatsappNumber,
                siteConfig.whatsappPrefillMessage
              )
            : undefined
        }
        label={siteConfig.whatsappLabel}
      />
      {chatbotConfig.enabled ? (
        <DeferredChatbot
          title={chatbotConfig.title}
          launcherLabel={chatbotConfig.launcherLabel}
          welcomeMessage={chatbotConfig.welcomeMessage}
          inputPlaceholder={chatbotConfig.inputPlaceholder}
        />
      ) : null}
    </>
  );
}
