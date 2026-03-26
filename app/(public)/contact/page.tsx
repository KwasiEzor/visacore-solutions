import type { Metadata } from "next"
import { ContactForm } from "@/components/public/contact-form"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez VisaCore Solutions à Lomé, Togo. Nous sommes disponibles pour répondre à vos questions sur l'immigration.",
}

const contactInfo = [
  { icon: MapPin, label: "Adresse", value: "Boulevard du 13 Janvier, Lomé, Togo" },
  { icon: Phone, label: "Téléphone", value: "+228 90 00 00 00", href: "tel:+22890000000" },
  { icon: Mail, label: "Email", value: "contact@visacore.com", href: "mailto:contact@visacore-solutions.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "+228 90 00 00 00", href: "https://wa.me/22890000000" },
  { icon: Clock, label: "Horaires", value: "Lun - Ven: 8h - 18h | Sam: 9h - 13h" },
]

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute -bottom-24 -left-24 size-96 bg-visacore-gold/10 rounded-full blur-[100px]" />
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <Send className="size-4" />
                Contact
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Parlons de Votre <br /><span className="text-visacore-gold italic serif">Projet</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                Une question ? Un doute ? Notre équipe d&apos;experts est à votre entière disposition pour éclairer votre parcours.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid gap-20 lg:grid-cols-5 items-start">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-4xl font-black text-visacore-navy mb-6">Nos <span className="text-visacore-gold serif italic">Coordonnées</span></h2>
                <p className="text-lg text-muted-foreground mb-12 font-medium">
                  Passez nous voir à notre bureau de Lomé ou contactez-nous par le canal qui vous convient le mieux.
                </p>
                
                <div className="space-y-8">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-6 group">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-visacore-navy text-visacore-gold group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-300">
                        <item.icon className="size-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-visacore-gold mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-xl font-bold text-visacore-navy hover:text-visacore-gold transition-colors" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-xl font-bold text-visacore-navy">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="mt-16 relative overflow-hidden rounded-[40px] h-64 bg-visacore-navy group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                       <MapPin className="size-8 text-visacore-gold" />
                       <span className="font-black text-visacore-navy uppercase tracking-tighter">Lomé, Togo</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.2}>
                <div className="rounded-[50px] bg-white border border-border p-10 md:p-16 shadow-2xl shadow-visacore-navy/5">
                  <h2 className="text-3xl font-black text-visacore-navy mb-2 text-center">Écrivez-nous</h2>
                  <p className="text-muted-foreground font-medium text-center mb-12">
                    Nous traitons chaque message avec une attention prioritaire.
                  </p>
                  <ContactForm />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
