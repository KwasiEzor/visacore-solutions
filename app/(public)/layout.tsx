import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let socialLinks: Record<string, string> = {};

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: ["social_facebook", "social_linkedin", "social_instagram", "social_whatsapp"] },
      },
    });
    socialLinks = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch {
    // Fallback to empty
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer socialLinks={socialLinks} />
      <WhatsAppButton />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
