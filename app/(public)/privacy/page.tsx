import type { Metadata } from "next"
import { getPublicSiteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de VisaCore Solutions — Protection de vos données personnelles conformément au RGPD.",
}

export default async function PrivacyPage() {
  const siteConfig = await getPublicSiteConfig()

  return (
    <div className="pt-40 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-visacore-navy mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-visacore-navy/50 mb-12">
          Dernière mise à jour : Mars 2026
        </p>

        <div className="prose prose-lg max-w-none text-visacore-navy/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">1. Responsable du traitement</h2>
            <p>
              VisaCore Solutions, société basée à Lomé, Togo, est responsable du traitement de vos données personnelles.
              Pour toute question relative à la protection de vos données, vous pouvez nous contacter à{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-visacore-gold hover:underline">
                {siteConfig.contactEmail}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données d&apos;identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone</li>
              <li><strong>Données de projet :</strong> pays de destination, type de visa souhaité, situation actuelle</li>
              <li><strong>Données de navigation :</strong> cookies, adresse IP, pages visitées</li>
              <li><strong>Données de communication :</strong> messages envoyés via nos formulaires de contact</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">3. Finalités du traitement</h2>
            <p>Vos données sont traitées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Répondre à vos demandes de renseignements et de consultation</li>
              <li>Évaluer votre éligibilité aux programmes d&apos;immigration</li>
              <li>Gérer vos rendez-vous et le suivi de votre dossier</li>
              <li>Vous envoyer des informations pertinentes sur nos services (avec votre consentement)</li>
              <li>Améliorer nos services et l&apos;expérience utilisateur de notre site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur votre consentement explicite, l&apos;exécution d&apos;un contrat
              ou nos intérêts légitimes dans le cadre de la fourniture de nos services de consultation en immigration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">5. Durée de conservation</h2>
            <p>
              Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées,
              et au maximum 3 ans après votre dernier contact avec nous, sauf obligation légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">6. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nos prestataires techniques (hébergement, e-mail) dans le cadre strict de leurs missions</li>
              <li>Les autorités compétentes si la loi l&apos;exige</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">7. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-visacore-gold hover:underline">
                {siteConfig.contactEmail}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">8. Cookies</h2>
            <p>
              Notre site utilise des cookies essentiels au fonctionnement du site et des cookies analytiques
              pour comprendre comment vous utilisez notre site. Vous pouvez paramétrer vos préférences de cookies
              dans les réglages de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
              contre l&apos;accès non autorisé, la perte ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-visacore-navy">10. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, contactez-nous :<br />
              <strong>VisaCore Solutions</strong><br />
              {siteConfig.officeAddress}<br />
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-visacore-gold hover:underline">
                {siteConfig.contactEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
