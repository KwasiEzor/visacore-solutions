import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/lib/prisma";
import { fallbackServices } from "@/lib/public-content";
import { getPublicSiteConfig, getWhatsAppHref } from "@/lib/site-config";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getPublicSiteConfig()
  let footerServices = fallbackServices.map((service) => ({
    slug: service.slug,
    name: service.name,
  }))

  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 5,
      select: {
        slug: true,
        name: true,
      },
    })

    if (services.length > 0) {
      footerServices = services
    }
  } catch {
    // Fall back to static services when the database is unavailable.
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer siteConfig={siteConfig} services={footerServices} />
      <WhatsAppButton href={getWhatsAppHref(siteConfig.whatsappNumber)} />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
