import type { Metadata } from "next"
import { PrivacyRequestForm } from "@/components/public/privacy-request-form"
import { getCaptchaServerConfig } from "@/lib/captcha.server"
import { getPublicSiteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Politique de confidentialite de VisaCore Solutions et modalites d'exercice des droits relatifs aux donnees personnelles.",
}

export default async function PrivacyPage() {
  const [siteConfig, captchaConfig] = await Promise.all([
    getPublicSiteConfig(),
    Promise.resolve(getCaptchaServerConfig()),
  ])

  return (
    <div className="pb-20 pt-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="mb-4 text-4xl font-black text-visacore-navy">
            Politique de confidentialite
          </h1>
          <p className="mb-3 text-visacore-navy/60">
            Derniere mise a jour : 28 mars 2026
          </p>
          <p className="text-lg leading-8 text-visacore-navy/80">
            Cette page explique quelles donnees VisaCore Solutions collecte,
            pourquoi elles sont traitees, combien de temps elles sont
            conservees et comment exercer vos droits. Elle decrit egalement le
            dispositif concret mis en place pour les demandes RGPD.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                1. Responsable du traitement
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                VisaCore Solutions, basee a Lome, Togo, agit comme responsable
                du traitement pour les donnees collectees via ce site et dans le
                cadre de ses services d&apos;accompagnement en immigration. Pour
                toute question relative a la protection des donnees, vous pouvez
                nous ecrire a{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-semibold text-visacore-gold hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>
                .
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                2. Categories de donnees traitees
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-visacore-navy/80">
                <li>
                  Donnees d&apos;identification et de contact : nom, email, numero
                  de telephone.
                </li>
                <li>
                  Donnees liees a votre projet : pays de destination, besoin
                  d&apos;accompagnement, disponibilites, contenu de vos messages.
                </li>
                <li>
                  Donnees operationnelles : statut de suivi, notes internes de
                  prise en charge, historisation des demandes.
                </li>
                <li>
                  Donnees techniques strictement necessaires a la securite et au
                  fonctionnement du site : journaux techniques, adresse IP
                  transmise par l&apos;infrastructure et jetons anti-abus lorsqu&apos;une
                  verification de formulaire est activee.
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                3. Finalites et bases legales
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-visacore-navy/80">
                <li>
                  Repondre a vos demandes de contact, d&apos;evaluation et de
                  rendez-vous : execution de mesures precontractuelles ou
                  interet legitime.
                </li>
                <li>
                  Assurer le suivi commercial et operationnel de votre dossier :
                  interet legitime et, le cas echeant, execution contractuelle.
                </li>
                <li>
                  Securiser les formulaires et prevenir le spam ou les abus :
                  interet legitime.
                </li>
                <li>
                  Traiter les demandes d&apos;exercice des droits relatifs aux
                  donnees personnelles : obligation legale et accountability.
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                4. Conservation
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                Les donnees de contact, de lead et de rendez-vous sont
                conservees pendant la duree necessaire au suivi de la relation
                puis au maximum 3 ans apres le dernier contact utile, sauf
                obligation legale ou besoin probatoire contraire. Lorsqu&apos;une
                demande d&apos;effacement aboutit, les donnees des formulaires sont
                anonymisees de maniere technique afin de supprimer les elements
                directement identifiants tout en preservant un minimum de trace
                operationnelle. Les demandes RGPD elles-memes peuvent etre
                conservees de facon limitee pour documenter la conformite et la
                reponse apportee.
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                5. Destinataires
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                Vos donnees ne sont pas vendues. Elles sont accessibles aux
                collaborateurs autorises de VisaCore Solutions et, lorsque cela
                est necessaire, a des sous-traitants techniques intervenant pour
                l&apos;hebergement, l&apos;envoi d&apos;emails transactionnels, la protection
                anti-abus ou la maintenance du site, dans la limite de leurs
                missions.
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                6. Vos droits
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-visacore-navy/80">
                <li>Droit d&apos;acces a vos donnees.</li>
                <li>Droit de rectification des donnees inexactes.</li>
                <li>Droit a l&apos;effacement dans les cas prevus par la loi.</li>
                <li>Droit a la portabilite lorsque le RGPD le permet.</li>
                <li>Droit d&apos;opposition a certains traitements.</li>
                <li>
                  Droit de retirer votre consentement lorsqu&apos;un traitement en
                  depend.
                </li>
              </ul>
              <p className="mt-4 text-visacore-navy/80">
                Nous accusons reception des demandes sans retard injustifie et y
                repondons au plus tard dans un delai d&apos;un mois. Ce delai peut
                etre prolonge jusqu&apos;a deux mois supplementaires si la demande
                est complexe ou multiple, avec information motivee. Une
                verification d&apos;identite peut etre demandee avant toute
                exportation, rectification ou suppression.
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                7. Cookies et traceurs
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                A la date du 28 mars 2026, ce site n&apos;embarque pas d&apos;outil
                d&apos;analytics marketing ou publicitaire identifie dans le code
                applicatif. Les traceurs strictement necessaires au
                fonctionnement, a la session d&apos;administration, a la securite et
                a la prevention des abus peuvent toutefois etre utilises. Si des
                traceurs non essentiels sont ajoutes ulterieurement, ils devront
                etre encadres par un mecanisme de consentement conforme avant
                depot, sauf cas d&apos;exemption applicable.
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                8. Securite
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                Des mesures techniques et organisationnelles sont mises en place
                pour limiter les acces non autorises, les abus de formulaires et
                la divulgation accidentelle. La securite absolue n&apos;existe pas,
                mais le traitement est concu pour reduire raisonnablement les
                risques et journaliser les actions sensibles.
              </p>
            </section>

            <section className="rounded-3xl border border-visacore-navy/10 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-visacore-navy">
                9. Contact
              </h2>
              <p className="mt-4 text-visacore-navy/80">
                Pour toute question sur cette politique ou sur la gestion de vos
                donnees :
              </p>
              <div className="mt-4 space-y-1 text-visacore-navy/80">
                <p className="font-semibold text-visacore-navy">
                  VisaCore Solutions
                </p>
                <p>{siteConfig.officeAddress}</p>
                <p>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-semibold text-visacore-gold hover:underline"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </p>
                <p>{siteConfig.contactPhone}</p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-visacore-gold/20 bg-[#F7F2E8] p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-visacore-gold">
                Exercer vos droits
              </p>
              <h2 className="mt-3 text-2xl font-black text-visacore-navy">
                Demande RGPD
              </h2>
              <p className="mt-3 text-sm leading-6 text-visacore-navy/75">
                Utilisez ce formulaire pour l&apos;acces, la rectification,
                l&apos;effacement, la portabilite, l&apos;opposition ou le retrait du
                consentement. Une verification d&apos;identite peut etre demandee
                avant execution.
              </p>
              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                <PrivacyRequestForm
                  captchaSiteKey={captchaConfig.siteKey}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
