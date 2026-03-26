import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
