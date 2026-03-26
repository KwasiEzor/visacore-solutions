import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et conditions générales d'utilisation de VisaCore Solutions.",
}

export default function TermsPage() {
  return (
    <div className="pt-40 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-visacore-navy mb-4">
          Mentions légales &amp; Conditions d&apos;utilisation
        </h1>
        <p className="text-visacore-navy/50 mb-12">
          Dernière mise à jour : Mars 2026
        </p>

        <div className="prose prose-lg max-w-none text-visacore-navy/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">1. Éditeur du site</h2>
            <p>
              <strong>VisaCore Solutions</strong><br />
              Boulevard du 13 Janvier, Lomé, Togo<br />
              E-mail : <a href="mailto:contact@visacore-solutions.com" className="text-visacore-gold hover:underline">contact@visacore-solutions.com</a><br />
              Téléphone : +228 90 00 00 00
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">2. Hébergement</h2>
            <p>
              Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">3. Objet du site</h2>
            <p>
              Le site visacore-solutions.com a pour objet de présenter les services de consultation en immigration
              proposés par VisaCore Solutions et de permettre aux utilisateurs de prendre contact avec nos consultants.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes, icônes) est la propriété exclusive
              de VisaCore Solutions ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation
              de tout ou partie de ce contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">5. Limitation de responsabilité</h2>
            <p>
              Les informations fournies sur ce site sont à titre indicatif et ne constituent pas un conseil juridique.
              VisaCore Solutions s&apos;efforce de fournir des informations exactes et à jour, mais ne garantit pas
              l&apos;exhaustivité ou l&apos;exactitude des informations publiées.
            </p>
            <p>
              Les résultats des demandes de visa et d&apos;immigration dépendent des autorités compétentes de chaque pays.
              VisaCore Solutions ne peut garantir l&apos;issue favorable d&apos;une demande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">6. Services de consultation</h2>
            <p>
              Nos services de consultation comprennent :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>L&apos;évaluation de l&apos;éligibilité aux programmes d&apos;immigration</li>
              <li>L&apos;accompagnement dans la constitution des dossiers</li>
              <li>Le conseil sur les procédures de visa</li>
              <li>Le suivi personnalisé des demandes</li>
            </ul>
            <p className="mt-4">
              Les frais de consultation sont communiqués préalablement à tout engagement.
              Ils sont distincts des frais officiels de visa et d&apos;immigration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">7. Utilisation du site</h2>
            <p>
              L&apos;utilisateur s&apos;engage à utiliser le site conformément à sa destination et à ne pas :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir de fausses informations dans les formulaires</li>
              <li>Tenter d&apos;accéder de manière non autorisée aux systèmes du site</li>
              <li>Utiliser le site à des fins illicites ou non autorisées</li>
              <li>Perturber le fonctionnement normal du site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">8. Liens externes</h2>
            <p>
              Ce site peut contenir des liens vers des sites tiers. VisaCore Solutions n&apos;exerce aucun contrôle
              sur le contenu de ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">9. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit togolais.
              Tout litige relatif à l&apos;utilisation de ce site sera soumis aux tribunaux compétents de Lomé, Togo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">10. Contact</h2>
            <p>
              Pour toute question, contactez-nous :<br />
              <strong>VisaCore Solutions</strong><br />
              Boulevard du 13 Janvier, Lomé, Togo<br />
              <a href="mailto:contact@visacore-solutions.com" className="text-visacore-gold hover:underline">
                contact@visacore-solutions.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
