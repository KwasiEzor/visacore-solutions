import type { Metadata } from "next"
import { ContactForm } from "@/components/public/contact-form"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez VisaCore Solutions à Lomé, Togo. Nous sommes disponibles pour répondre à vos questions sur l'immigration.",
}

const contactInfo = [
  { icon: MapPin, label: "Adresse", value: "Boulevard du 13 Janvier, Lomé, Togo" },
  { icon: Phone, label: "Téléphone", value: "+228 90 00 00 00", href: "tel:+22890000000" },
  { icon: Mail, label: "Email", value: "contact@visacore-solutions.com", href: "mailto:contact@visacore-solutions.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "+228 90 00 00 00", href: "https://wa.me/22890000000" },
  { icon: Clock, label: "Horaires", value: "Lun - Ven: 8h - 18h | Sam: 9h - 13h" },
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#0A2540] px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">Contactez-nous</h1>
        <p className="mt-4 text-lg text-white/70">
          Notre équipe est disponible pour répondre à toutes vos questions.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0A2540]">Nos coordonnées</h2>
            <p className="mt-2 text-muted-foreground">
              Passez nous voir à notre bureau ou contactez-nous par téléphone, email ou WhatsApp.
            </p>
            <div className="mt-8 space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0A2540]/5">
                    <item.icon className="size-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A2540]">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-muted-foreground hover:text-[#C9A227]" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 flex h-48 items-center justify-center rounded-xl bg-secondary/50">
              <div className="text-center">
                <MapPin className="mx-auto size-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Carte interactive - à venir</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border p-6 shadow-sm lg:p-8">
              <h2 className="text-2xl font-bold text-[#0A2540]">Envoyez-nous un message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
