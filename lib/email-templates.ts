import {
  formatDisplayPhoneNumber,
  getBusinessHoursRows,
  type PublicSiteConfig,
} from "@/lib/site-config"

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailAction {
  label: string
  href: string
}

interface SummaryItem {
  label: string
  value: string
}

interface EmailShellInput {
  previewText: string
  eyebrow: string
  title: string
  intro: string
  summary?: SummaryItem[]
  bulletPoints?: string[]
  action?: EmailAction
  secondaryNote?: string
  trustNote?: string
  siteConfig: PublicSiteConfig
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderSummary(summary: SummaryItem[] | undefined) {
  if (!summary?.length) return ""

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top:24px;">
      ${summary
        .map(
          (item) => `
            <tr>
              <td style="padding:10px 0; border-bottom:1px solid #e5e7eb; color:#475569; font-size:13px; width:36%; vertical-align:top;">
                ${escapeHtml(item.label)}
              </td>
              <td style="padding:10px 0; border-bottom:1px solid #e5e7eb; color:#0f172a; font-size:14px; font-weight:600; vertical-align:top;">
                ${escapeHtml(item.value)}
              </td>
            </tr>
          `
        )
        .join("")}
    </table>
  `
}

function renderBulletPoints(bulletPoints: string[] | undefined) {
  if (!bulletPoints?.length) return ""

  return `
    <ul style="margin:20px 0 0; padding-left:20px; color:#334155; font-size:14px; line-height:1.7;">
      ${bulletPoints
        .map((point) => `<li style="margin:0 0 10px;">${escapeHtml(point)}</li>`)
        .join("")}
    </ul>
  `
}

function renderAction(action: EmailAction | undefined) {
  if (!action) return ""

  return `
    <div style="margin-top:28px;">
      <a
        href="${escapeHtml(action.href)}"
        style="display:inline-block; border-radius:12px; background:#0A2540; color:#ffffff; font-size:14px; font-weight:700; line-height:1; padding:14px 18px; text-decoration:none;"
      >
        ${escapeHtml(action.label)}
      </a>
    </div>
  `
}

function renderBusinessHours(siteConfig: PublicSiteConfig) {
  return getBusinessHoursRows(siteConfig.businessHours)
    .map((row) => `${row.label}: ${row.value}`)
    .join(" | ")
}

function renderShell({
  previewText,
  eyebrow,
  title,
  intro,
  summary,
  bulletPoints,
  action,
  secondaryNote,
  trustNote,
  siteConfig,
}: EmailShellInput): EmailTemplate {
  const sitePhone = formatDisplayPhoneNumber(siteConfig.contactPhone)
  const hours = renderBusinessHours(siteConfig)

  const html = `
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      ${escapeHtml(previewText)}
    </div>
    <div style="margin:0; background:#f8fafc; padding:32px 12px; font-family:Arial, Helvetica, sans-serif; color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px; margin:0 auto; border-collapse:collapse;">
        <tr>
          <td style="border-radius:24px; overflow:hidden; background:#ffffff; box-shadow:0 20px 45px rgba(15,23,42,0.08);">
            <div style="background:linear-gradient(135deg, #0A2540 0%, #163C61 100%); padding:24px 28px;">
              <div style="display:inline-block; margin-bottom:12px; border-radius:999px; background:rgba(255,255,255,0.12); padding:6px 12px; color:#E0C161; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                ${escapeHtml(eyebrow)}
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:28px; line-height:1.2;">
                ${escapeHtml(title)}
              </h1>
              <p style="margin:14px 0 0; color:rgba(255,255,255,0.82); font-size:15px; line-height:1.7;">
                ${escapeHtml(intro)}
              </p>
            </div>

            <div style="padding:28px;">
              ${renderSummary(summary)}
              ${renderBulletPoints(bulletPoints)}
              ${renderAction(action)}

              ${
                secondaryNote
                  ? `<p style="margin:24px 0 0; color:#475569; font-size:13px; line-height:1.7;">${escapeHtml(secondaryNote)}</p>`
                  : ""
              }

              <div style="margin-top:28px; border-radius:18px; background:#f8fafc; padding:18px 20px;">
                <p style="margin:0 0 8px; color:#0f172a; font-size:14px; font-weight:700;">
                  Repères de confiance
                </p>
                <ul style="margin:0; padding-left:18px; color:#475569; font-size:13px; line-height:1.7;">
                  <li>Cabinet basé à Lomé, Togo.</li>
                  <li>Réponse humaine sous 24h ouvrées sur les nouvelles demandes.</li>
                  <li>Nous ne demandons jamais de paiement ni de document sensible par email sans validation préalable.</li>
                  <li>Canaux officiels: ${escapeHtml(siteConfig.contactEmail)} et ${escapeHtml(sitePhone)}.</li>
                </ul>
                ${
                  trustNote
                    ? `<p style="margin:12px 0 0; color:#475569; font-size:13px; line-height:1.7;">${escapeHtml(trustNote)}</p>`
                    : ""
                }
              </div>

              <div style="margin-top:28px; border-top:1px solid #e5e7eb; padding-top:18px; color:#64748b; font-size:12px; line-height:1.8;">
                <strong style="color:#0f172a;">${escapeHtml(siteConfig.siteName)}</strong><br />
                ${escapeHtml(siteConfig.officeAddress)}<br />
                ${escapeHtml(siteConfig.contactEmail)} · ${escapeHtml(sitePhone)}<br />
                ${escapeHtml(hours)}
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `

  const text = [
    title,
    "",
    intro,
    "",
    ...(summary?.length
      ? [
          "Resume:",
          ...summary.map((item) => `- ${item.label}: ${item.value}`),
          "",
        ]
      : []),
    ...(bulletPoints?.length
      ? ["Points utiles:", ...bulletPoints.map((point) => `- ${point}`), ""]
      : []),
    ...(action ? [`Action: ${action.label} - ${action.href}`, ""] : []),
    ...(secondaryNote ? [secondaryNote, ""] : []),
    "Reperes de confiance:",
    "- Cabinet base a Lome, Togo.",
    "- Reponse humaine sous 24h ouvrees sur les nouvelles demandes.",
    "- Nous ne demandons jamais de paiement ni de document sensible par email sans validation prealable.",
    `- Canaux officiels: ${siteConfig.contactEmail} / ${sitePhone}.`,
    ...(trustNote ? [trustNote] : []),
    "",
    `${siteConfig.siteName}`,
    siteConfig.officeAddress,
    `${siteConfig.contactEmail} / ${sitePhone}`,
    hours,
  ].join("\n")

  return { subject: title, html, text }
}

export function buildLeadAcknowledgementEmail({
  fullName,
  destination,
  serviceNeeded,
  siteConfig,
}: {
  fullName: string
  destination: string
  serviceNeeded?: string | null
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre demande d'evaluation a bien ete recue.",
      eyebrow: "Demande recue",
      title: "Votre demande d'evaluation est bien enregistree",
      intro: `Bonjour ${fullName}, votre demande a bien ete recue par ${siteConfig.siteName}. Un conseiller analysera votre profil et reviendra vers vous avec les prochaines etapes.`,
      summary: [
        { label: "Destination cible", value: destination },
        {
          label: "Service demande",
          value: serviceNeeded || "Evaluation personnalisée",
        },
      ],
      bulletPoints: [
        "Nous verifions la coherence de votre projet et les options les plus adaptees.",
        "Vous recevrez un retour humain sous 24h ouvrees.",
        "Gardez vos documents principaux disponibles pour accelerer l'echange.",
      ],
      action: {
        label: "Nous contacter",
        href: `mailto:${siteConfig.contactEmail}`,
      },
      secondaryNote:
        "Si vous avez oublie un detail important, vous pouvez repondre a cet email ou contacter notre equipe via les canaux officiels.",
      trustNote:
        "Conservez cet email comme accuse de reception de votre demande.",
      siteConfig,
    }),
    subject: "Votre demande d'evaluation a bien ete recue - VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildLeadAdminAlertEmail({
  fullName,
  destination,
  serviceNeeded,
  email,
  phone,
  adminUrl,
  siteConfig,
}: {
  fullName: string
  destination: string
  serviceNeeded?: string | null
  email: string
  phone: string
  adminUrl: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Un nouveau lead attend un traitement.",
      eyebrow: "Alerte commerciale",
      title: "Nouveau lead a traiter",
      intro: `Une nouvelle demande d'evaluation est entree dans le pipeline ${siteConfig.siteName}.`,
      summary: [
        { label: "Nom", value: fullName },
        { label: "Email", value: email },
        { label: "Telephone", value: phone },
        { label: "Destination", value: destination },
        { label: "Service", value: serviceNeeded || "Non specifie" },
      ],
      bulletPoints: [
        "Verifier la qualification du projet et prioriser le premier contact.",
        "Respecter le delai annonce au prospect: retour humain sous 24h ouvrees.",
      ],
      action: {
        label: "Ouvrir le lead",
        href: adminUrl,
      },
      secondaryNote:
        "Ce message a ete genere automatiquement a la creation du lead.",
      siteConfig,
    }),
    subject: `Nouveau lead - ${fullName} - ${destination}`,
  } satisfies EmailTemplate
}

export function buildContactAcknowledgementEmail({
  fullName,
  subjectLine,
  siteConfig,
}: {
  fullName: string
  subjectLine: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre message a bien ete transmis a notre equipe.",
      eyebrow: "Message recu",
      title: "Votre message a bien ete transmis",
      intro: `Bonjour ${fullName}, nous avons bien recu votre message. Un conseiller ${siteConfig.siteName} reviendra vers vous dans les plus brefs delais.`,
      summary: [{ label: "Sujet", value: subjectLine }],
      bulletPoints: [
        "Votre message a ete enregistre dans notre file de traitement.",
        "Notre equipe vous repondra via votre adresse email ou votre numero de contact si necessaire.",
      ],
      action: {
        label: "Repondre par email",
        href: `mailto:${siteConfig.contactEmail}`,
      },
      secondaryNote:
        "Si votre demande est urgente, utilisez aussi notre numero officiel pour accelerer la prise en charge.",
      siteConfig,
    }),
    subject: "Votre message a bien ete recu - VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildContactAdminAlertEmail({
  fullName,
  subjectLine,
  email,
  phone,
  adminUrl,
  siteConfig,
}: {
  fullName: string
  subjectLine: string
  email: string
  phone?: string | null
  adminUrl: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Un nouveau message de contact est disponible.",
      eyebrow: "Alerte support",
      title: "Nouveau message de contact",
      intro: `Un nouveau message a ete recu sur le site ${siteConfig.siteName}.`,
      summary: [
        { label: "Nom", value: fullName },
        { label: "Email", value: email },
        { label: "Telephone", value: phone || "Non renseigne" },
        { label: "Sujet", value: subjectLine },
      ],
      action: {
        label: "Ouvrir le message",
        href: adminUrl,
      },
      secondaryNote:
        "Pensez a qualifier le message et a mettre son statut a jour apres traitement.",
      siteConfig,
    }),
    subject: `Nouveau message de contact - ${fullName}`,
  } satisfies EmailTemplate
}

export function buildAppointmentAcknowledgementEmail({
  fullName,
  preferredDate,
  preferredTime,
  serviceType,
  destinationType,
  siteConfig,
}: {
  fullName: string
  preferredDate?: string | null
  preferredTime?: string | null
  serviceType?: string | null
  destinationType?: string | null
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre demande de rendez-vous a ete recue.",
      eyebrow: "Rendez-vous",
      title: "Votre demande de rendez-vous est en attente de validation",
      intro: `Bonjour ${fullName}, votre demande de rendez-vous a bien ete recue. Notre equipe verifiera la disponibilite et reviendra vers vous avec une confirmation.`,
      summary: [
        { label: "Date souhaitee", value: preferredDate || "A convenir" },
        { label: "Heure souhaitee", value: preferredTime || "A convenir" },
        { label: "Service", value: serviceType || "Non specifie" },
        { label: "Destination", value: destinationType || "Non specifie" },
      ],
      bulletPoints: [
        "Nous validons la meilleure plage disponible avec un conseiller.",
        "Une confirmation ou une proposition alternative vous sera envoyee rapidement.",
      ],
      action: {
        label: "Contacter l'equipe",
        href: `mailto:${siteConfig.contactEmail}`,
      },
      siteConfig,
    }),
    subject: "Votre demande de rendez-vous a bien ete recue - VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildAppointmentAdminAlertEmail({
  fullName,
  email,
  phone,
  preferredDate,
  preferredTime,
  serviceType,
  adminUrl,
  siteConfig,
}: {
  fullName: string
  email: string
  phone: string
  preferredDate?: string | null
  preferredTime?: string | null
  serviceType?: string | null
  adminUrl: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Une nouvelle demande de rendez-vous attend un traitement.",
      eyebrow: "Alerte planning",
      title: "Nouvelle demande de rendez-vous",
      intro: "Une nouvelle demande de rendez-vous vient d'etre enregistree.",
      summary: [
        { label: "Nom", value: fullName },
        { label: "Email", value: email },
        { label: "Telephone", value: phone },
        { label: "Date souhaitee", value: preferredDate || "A convenir" },
        { label: "Heure souhaitee", value: preferredTime || "A convenir" },
        { label: "Service", value: serviceType || "Non specifie" },
      ],
      action: {
        label: "Ouvrir le rendez-vous",
        href: adminUrl,
      },
      secondaryNote:
        "Validez ou replanifiez rapidement pour maintenir une experience premium.",
      siteConfig,
    }),
    subject: `Nouvelle demande de rendez-vous - ${fullName}`,
  } satisfies EmailTemplate
}

export function buildAppointmentStatusEmail({
  fullName,
  statusLabel,
  preferredDate,
  preferredTime,
  message,
  siteConfig,
}: {
  fullName: string
  statusLabel: string
  preferredDate?: string | null
  preferredTime?: string | null
  message: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: `Le statut de votre rendez-vous est maintenant: ${statusLabel}.`,
      eyebrow: "Mise a jour rendez-vous",
      title: `Statut du rendez-vous: ${statusLabel}`,
      intro: `Bonjour ${fullName}, ${message}`,
      summary: [
        { label: "Date concernee", value: preferredDate || "A convenir" },
        { label: "Heure", value: preferredTime || "A convenir" },
      ],
      action: {
        label: "Ecrire a notre equipe",
        href: `mailto:${siteConfig.contactEmail}`,
      },
      trustNote:
        "En cas de replanification, utilisez exclusivement les canaux officiels du cabinet.",
      siteConfig,
    }),
    subject: `Mise a jour de votre rendez-vous - ${statusLabel}`,
  } satisfies EmailTemplate
}

export function buildLeadAssignmentEmail({
  assigneeName,
  leadName,
  destination,
  adminUrl,
  siteConfig,
}: {
  assigneeName: string
  leadName: string
  destination: string
  adminUrl: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Un lead vous a ete assigne.",
      eyebrow: "Attribution",
      title: "Un lead vous a ete assigne",
      intro: `Bonjour ${assigneeName}, un nouveau lead vous a ete attribue dans ${siteConfig.siteName}.`,
      summary: [
        { label: "Prospect", value: leadName },
        { label: "Destination", value: destination },
      ],
      bulletPoints: [
        "Prenez connaissance du dossier et contactez le prospect dans le delai prevu.",
        "Mettez a jour le statut et les notes dans l'admin apres votre premier contact.",
      ],
      action: {
        label: "Ouvrir le lead",
        href: adminUrl,
      },
      siteConfig,
    }),
    subject: `Lead assigne - ${leadName}`,
  } satisfies EmailTemplate
}

export function buildUserWelcomeEmail({
  userName,
  roleLabel,
  loginUrl,
  createdByName,
  siteConfig,
}: {
  userName: string
  roleLabel: string
  loginUrl: string
  createdByName?: string | null
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre acces administrateur a ete cree.",
      eyebrow: "Acces admin",
      title: "Votre acces administrateur est pret",
      intro: `Bonjour ${userName}, un acces ${roleLabel.toLowerCase()} a ete cree pour vous sur l'espace administrateur ${siteConfig.siteName}.`,
      bulletPoints: [
        "Connectez-vous des que possible et verifiez vos informations de profil.",
        "Le mot de passe est communique via le canal securise defini par votre administrateur.",
        "Ne transferez pas cet email et activez de bonnes pratiques de securite des votre premiere connexion.",
      ],
      action: {
        label: "Acceder a l'administration",
        href: loginUrl,
      },
      secondaryNote: createdByName
        ? `Compte cree par ${createdByName}.`
        : "Compte cree par un administrateur VisaCore Solutions.",
      trustNote:
        "Si vous n'attendiez pas cet acces, contactez immediatement l'administrateur principal.",
      siteConfig,
    }),
    subject: "Votre acces administrateur VisaCore Solutions est cree",
  } satisfies EmailTemplate
}

export function buildAccountInvitationEmail({
  userName,
  roleLabel,
  accessUrl,
  expiresLabel,
  createdByName,
  siteConfig,
}: {
  userName: string
  roleLabel: string
  accessUrl: string
  expiresLabel: string
  createdByName?: string | null
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre invitation administrateur est prete.",
      eyebrow: "Invitation securisee",
      title: "Configurez votre acces administrateur",
      intro: `Bonjour ${userName}, un acces ${roleLabel.toLowerCase()} vous a ete attribue sur ${siteConfig.siteName}.`,
      bulletPoints: [
        "Ce lien est personnel, temporaire et a usage unique.",
        "Choisissez un mot de passe fort lors de l'activation de votre compte.",
        "Une fois l'acces configure, vous pourrez vous connecter a l'administration.",
      ],
      action: {
        label: "Configurer mon acces",
        href: accessUrl,
      },
      secondaryNote: createdByName
        ? `Invitation envoyee par ${createdByName}.`
        : "Invitation envoyee par un administrateur VisaCore Solutions.",
      trustNote: `Lien valable jusqu'au ${expiresLabel}. Si vous ne l'utilisez pas avant expiration, demandez un nouveau lien via l'equipe ou l'ecran de recuperation d'acces.`,
      siteConfig,
    }),
    subject: "Invitation administrateur - Configurez votre acces VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildApplicantPortalInvitationEmail({
  userName,
  accessUrl,
  expiresLabel,
  createdByName,
  siteConfig,
}: {
  userName: string
  accessUrl: string
  expiresLabel: string
  createdByName?: string | null
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre espace client VisaCore est pret.",
      eyebrow: "Espace client",
      title: "Activez votre espace demandeur",
      intro: `Bonjour ${userName}, votre espace client securise est pret sur ${siteConfig.siteName}. Vous pourrez y suivre votre procedure, vos prochaines etapes et les documents attendus.`,
      bulletPoints: [
        "Ce lien est personnel, temporaire et a usage unique.",
        "Une fois le mot de passe choisi, vous accederez a votre tableau de bord client.",
        "Vos mises a jour de dossier, pieces a fournir et rendez-vous y seront centralises.",
      ],
      action: {
        label: "Activer mon espace client",
        href: accessUrl,
      },
      secondaryNote: createdByName
        ? `Invitation envoyee par ${createdByName}.`
        : "Invitation envoyee par votre conseiller VisaCore Solutions.",
      trustNote: `Lien valable jusqu'au ${expiresLabel}. Si vous avez un doute, contactez notre equipe avant d'ouvrir toute piece ou de transmettre un document sensible.`,
      siteConfig,
    }),
    subject: "Votre espace client VisaCore Solutions est disponible",
  } satisfies EmailTemplate
}

export function buildPasswordResetEmail({
  userName,
  accessUrl,
  expiresLabel,
  siteConfig,
}: {
  userName: string
  accessUrl: string
  expiresLabel: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre lien de reinitialisation est pret.",
      eyebrow: "Recuperation d'acces",
      title: "Reinitialisez votre mot de passe",
      intro: `Bonjour ${userName}, nous avons recu une demande de reinitialisation pour votre acces ${siteConfig.siteName}.`,
      bulletPoints: [
        "Cliquez sur le lien ci-dessous pour definir un nouveau mot de passe.",
        "Si vous n'etes pas a l'origine de cette demande, ignorez simplement cet email.",
        "Aucun membre de notre equipe ne vous demandera de transmettre ce lien.",
      ],
      action: {
        label: "Reinitialiser mon mot de passe",
        href: accessUrl,
      },
      trustNote: `Lien valable jusqu'au ${expiresLabel}. Passe ce delai, une nouvelle demande sera necessaire.`,
      siteConfig,
    }),
    subject: "Reinitialisation de votre acces VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildApplicantPortalPasswordResetEmail({
  userName,
  accessUrl,
  expiresLabel,
  siteConfig,
}: {
  userName: string
  accessUrl: string
  expiresLabel: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre lien de reinitialisation client est pret.",
      eyebrow: "Espace client",
      title: "Retrouvez l'acces a votre espace client",
      intro: `Bonjour ${userName}, nous avons recu une demande de reinitialisation pour votre espace client ${siteConfig.siteName}.`,
      bulletPoints: [
        "Utilisez ce lien pour definir un nouveau mot de passe.",
        "Si vous n'etes pas a l'origine de cette demande, ignorez simplement cet email.",
        "Aucun membre de notre equipe ne vous demandera de partager ce lien ou votre mot de passe.",
      ],
      action: {
        label: "Reinitialiser mon acces client",
        href: accessUrl,
      },
      trustNote: `Lien valable jusqu'au ${expiresLabel}. Passe ce delai, une nouvelle demande sera necessaire.`,
      siteConfig,
    }),
    subject: "Reinitialisation de votre espace client VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildPrivacyRequestAcknowledgementEmail({
  fullName,
  requestTypeLabel,
  siteConfig,
}: {
  fullName: string
  requestTypeLabel: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Votre demande RGPD a bien ete recue.",
      eyebrow: "Protection des donnees",
      title: "Votre demande RGPD est enregistree",
      intro: `Bonjour ${fullName}, nous accusons reception de votre demande relative a vos donnees personnelles. Notre equipe l'examinera conformement au RGPD.`,
      summary: [{ label: "Type de demande", value: requestTypeLabel }],
      bulletPoints: [
        "Nous pouvons vous demander un element complementaire pour verifier votre identite avant execution.",
        "Une reponse vous sera apportee sans retard injustifie et au plus tard dans un delai d'un mois.",
        "Si la demande est complexe ou multiple, ce delai peut etre prolonge jusqu'a deux mois supplementaires avec information motivee.",
      ],
      action: {
        label: "Contacter notre equipe",
        href: `mailto:${siteConfig.contactEmail}`,
      },
      trustNote:
        "Conservez cet email comme preuve de reception de votre demande.",
      siteConfig,
    }),
    subject: "Accuse de reception de votre demande RGPD - VisaCore Solutions",
  } satisfies EmailTemplate
}

export function buildPrivacyRequestAdminAlertEmail({
  fullName,
  email,
  phone,
  requestTypeLabel,
  adminUrl,
  siteConfig,
}: {
  fullName: string
  email: string
  phone?: string | null
  requestTypeLabel: string
  adminUrl: string
  siteConfig: PublicSiteConfig
}) {
  return {
    ...renderShell({
      previewText: "Une nouvelle demande RGPD attend un traitement.",
      eyebrow: "Alerte conformite",
      title: "Nouvelle demande RGPD",
      intro: `Une nouvelle demande relative aux donnees personnelles a ete soumise sur ${siteConfig.siteName}.`,
      summary: [
        { label: "Nom", value: fullName },
        { label: "Email", value: email },
        { label: "Telephone", value: phone || "Non renseigne" },
        { label: "Type", value: requestTypeLabel },
      ],
      bulletPoints: [
        "Verifier l'identite du demandeur avant toute exportation ou effacement si necessaire.",
        "Consigner les actions de traitement et respecter le delai RGPD d'un mois.",
      ],
      action: {
        label: "Ouvrir la demande",
        href: adminUrl,
      },
      secondaryNote:
        "Ce message a ete genere automatiquement a la creation de la demande RGPD.",
      siteConfig,
    }),
    subject: `Nouvelle demande RGPD - ${fullName}`,
  } satisfies EmailTemplate
}
