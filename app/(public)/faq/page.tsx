import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Retrouvez les réponses aux questions les plus fréquentes sur l'immigration et nos services.",
}

const categoryLabels: Record<string, string> = {
  GENERAL: "Général",
  CANADA: "Canada",
  USA: "États-Unis",
  EUROPE: "Europe",
  DOCUMENTATION: "Documentation",
  PROCESS: "Processus & Consultation",
}

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  })

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <>
      <section className="bg-[#0A2540] px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">Foire aux questions</h1>
        <p className="mt-4 text-lg text-white/70">
          Retrouvez les réponses aux questions les plus fréquentes.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-[#0A2540]">
              {categoryLabels[category] ?? category}
            </h2>
            <Accordion>
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-medium text-[#0A2540] hover:text-[#C9A227]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {faqs.length === 0 && (
          <p className="text-center text-muted-foreground">Aucune FAQ disponible pour le moment.</p>
        )}
      </section>

      <section className="bg-secondary/30 px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#0A2540]">
          Vous n&apos;avez pas trouvé votre réponse ?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Notre équipe est disponible pour répondre à toutes vos questions.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/contact">
            <Button variant="outline" className="border-[#0A2540] text-[#0A2540] hover:bg-[#0A2540] hover:text-white">
              Nous contacter
            </Button>
          </Link>
          <Link href="/evaluation">
            <Button className="bg-[#C9A227] text-white hover:bg-[#A88620]">
              Évaluation gratuite
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
