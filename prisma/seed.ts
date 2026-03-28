import * as dotenv from "dotenv"
dotenv.config()
dotenv.config({ path: ".env.local" })

import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"
import {
  notificationSiteSettingCatalog,
  publicSiteSettingCatalog,
} from "../lib/site-config.shared"

const dbUrl = (process.env.DATABASE_URL ?? "").replace(/[&?]?channel_binding=[^&]*/g, "")
const pool = new pg.Pool({ connectionString: dbUrl })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter } as never)

async function main() {
  console.log("🌱 Seeding database...")

  // ─── Admin User ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("VisaCore2024!", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@visacore.com" },
    update: {},
    create: {
      name: "Admin VisaCore",
      email: "admin@visacore.com",
      hashedPassword,
      role: "SUPER_ADMIN",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // ─── Destinations ────────────────────────────────────────
  const canada = await prisma.destination.upsert({
    where: { slug: "canada" },
    update: {},
    create: {
      name: "Canada",
      slug: "canada",
      heroTitle: "Immigrer au Canada",
      heroDescription:
        "Le Canada offre des opportunités exceptionnelles pour les travailleurs qualifiés, les étudiants et les familles. Découvrez comment nous pouvons vous accompagner dans votre projet d'immigration canadienne.",
      opportunities: [
        {
          title: "Programme Entrée Express",
          description:
            "Voie rapide pour les profils qualifiés avec classement CRS et invitation à présenter une demande.",
        },
        {
          title: "Programme des Travailleurs Qualifiés",
          description:
            "Option adaptée aux professionnels ayant une expérience reconnue et un projet d'installation durable.",
        },
        {
          title: "Programmes Provinciaux (PNP)",
          description:
            "Solutions ciblées selon les besoins spécifiques des provinces canadiennes.",
        },
        {
          title: "Permis d'études",
          description:
            "Accès aux collèges et universités canadiennes avec accompagnement sur le projet académique.",
        },
        {
          title: "Permis de travail",
          description:
            "Parcours vers une insertion professionnelle légale et structurée au Canada.",
        },
        {
          title: "Regroupement familial",
          description:
            "Réunification des proches dans le respect des conditions d'immigration canadiennes.",
        },
      ],
      visaCategories: [
        { name: "Résidence permanente", description: "Entrée Express, PNP, parrainage familial" },
        { name: "Permis de travail", description: "Employeur désigné, EIMT, permis ouvert" },
        { name: "Permis d'études", description: "Universités, collèges, programmes de langue" },
        { name: "Visa visiteur", description: "Tourisme, visite familiale, super visa" },
      ],
      whyChoose: [
        {
          title: "Qualité de vie exceptionnelle",
          description:
            "Le Canada combine sécurité, stabilité et infrastructures modernes pour les familles comme pour les professionnels.",
        },
        {
          title: "Système de santé universel",
          description:
            "Les résidents bénéficient d'un accès structuré à un système de santé reconnu pour sa qualité.",
        },
        {
          title: "Éducation de classe mondiale",
          description:
            "Les établissements canadiens sont valorisés à l'international pour leur qualité académique.",
        },
        {
          title: "Économie stable et diversifiée",
          description:
            "Le marché canadien offre des perspectives dans la tech, la santé, l'ingénierie et bien d'autres secteurs.",
        },
        {
          title: "Société multiculturelle et accueillante",
          description:
            "L'intégration y est facilitée par un environnement ouvert à la diversité culturelle.",
        },
      ],
      ctaText: "Évaluer mon profil pour le Canada",
      published: true,
      order: 1,
      seoTitle: "Immigration au Canada depuis le Togo | VisaCore Solutions",
      seoDescription:
        "Expert en immigration canadienne depuis Lomé. Entrée Express, permis de travail, études au Canada. Accompagnement complet.",
    },
  })

  const usa = await prisma.destination.upsert({
    where: { slug: "etats-unis" },
    update: {},
    create: {
      name: "États-Unis",
      slug: "etats-unis",
      heroTitle: "Vivre aux États-Unis",
      heroDescription:
        "Les États-Unis restent une destination de premier choix pour les professionnels ambitieux et les étudiants. Notre expertise vous guide à travers le processus complexe de l'immigration américaine.",
      opportunities: [
        {
          title: "Visa H-1B",
          description:
            "Programme phare pour les travailleurs spécialisés recrutés par des employeurs américains.",
        },
        {
          title: "Visa L-1",
          description:
            "Solution pour les transferts intra-entreprise des cadres et profils stratégiques.",
        },
        {
          title: "Visa F-1",
          description:
            "Accès aux universités et établissements américains pour les projets académiques ambitieux.",
        },
        {
          title: "Visa J-1",
          description:
            "Programme d'échange pour la formation, la recherche ou certaines expériences professionnelles.",
        },
        {
          title: "DV Lottery",
          description:
            "Voie annuelle basée sur le tirage au sort pour accéder à une résidence permanente.",
        },
        {
          title: "Visa investisseur (EB-5)",
          description:
            "Option destinée aux profils capables d'investir dans un projet économique admissible.",
        },
      ],
      visaCategories: [
        { name: "Visa de travail", description: "H-1B, L-1, O-1, TN" },
        { name: "Visa étudiant", description: "F-1, J-1, M-1" },
        { name: "Green Card", description: "DV Lottery, EB, parrainage" },
        { name: "Visa visiteur", description: "B-1/B-2, ESTA" },
      ],
      whyChoose: [
        {
          title: "Première économie mondiale",
          description:
            "Les États-Unis concentrent un marché immense et des opportunités de croissance dans de nombreux secteurs.",
        },
        {
          title: "Universités de renommée mondiale",
          description:
            "Le pays abrite certaines des institutions académiques les plus reconnues au monde.",
        },
        {
          title: "Opportunités professionnelles majeures",
          description:
            "Les talents spécialisés y trouvent des perspectives d'évolution rapides et compétitives.",
        },
        {
          title: "Innovation et technologie de pointe",
          description:
            "L'écosystème américain reste un moteur central de l'innovation mondiale.",
        },
        {
          title: "Diversité culturelle incomparable",
          description:
            "La variété des profils, des régions et des industries favorise une intégration progressive.",
        },
      ],
      ctaText: "Évaluer mon profil pour les États-Unis",
      published: true,
      order: 2,
      seoTitle: "Immigration aux États-Unis depuis le Togo | VisaCore Solutions",
      seoDescription:
        "Visa américain depuis Lomé. H-1B, Green Card, DV Lottery, études aux USA. Conseils d'experts.",
    },
  })

  const europe = await prisma.destination.upsert({
    where: { slug: "europe" },
    update: {},
    create: {
      name: "Europe",
      slug: "europe",
      heroTitle: "S'installer en Europe",
      heroDescription:
        "L'Europe offre une qualité de vie remarquable et des opportunités diversifiées. De la France à l'Allemagne, du Royaume-Uni aux pays nordiques, nous vous guidons vers votre destination européenne idéale.",
      opportunities: [
        {
          title: "Visa Schengen",
          description:
            "Accès simplifié à l'espace Schengen pour les séjours courts, touristiques ou professionnels.",
        },
        {
          title: "Carte bleue européenne",
          description:
            "Option attractive pour les professionnels qualifiés visant une insertion durable en Europe.",
        },
        {
          title: "Études en France, Allemagne, Belgique",
          description:
            "Parcours académiques variés avec accompagnement sur l'admission et le visa étudiant.",
        },
        {
          title: "Regroupement familial",
          description:
            "Solutions pour rejoindre un proche établi légalement dans un pays européen.",
        },
        {
          title: "Visa long séjour",
          description:
            "Cadre adapté aux projets d'installation, de travail ou d'études sur plusieurs mois.",
        },
        {
          title: "Programmes de travail saisonnier",
          description:
            "Opportunités ciblées dans certains secteurs à forte demande de main-d'œuvre.",
        },
      ],
      visaCategories: [
        { name: "Visa de travail", description: "Carte bleue, visa salarié, détachement" },
        { name: "Visa étudiant", description: "Campus France, DAAD, Erasmus" },
        { name: "Visa long séjour", description: "Résidence, regroupement familial" },
        { name: "Visa Schengen", description: "Court séjour, tourisme, affaires" },
      ],
      whyChoose: [
        {
          title: "Richesse culturelle et historique",
          description:
            "L'Europe offre un cadre de vie varié avec des environnements culturels et professionnels distincts.",
        },
        {
          title: "Protection sociale avancée",
          description:
            "De nombreux pays européens proposent des systèmes sociaux structurés et protecteurs.",
        },
        {
          title: "Éducation accessible et de qualité",
          description:
            "Les étudiants peuvent accéder à des parcours reconnus, parfois à coûts maîtrisés.",
        },
        {
          title: "Proximité géographique avec l'Afrique",
          description:
            "La distance et les liaisons facilitent les échanges familiaux et professionnels.",
        },
        {
          title: "Espaces francophones",
          description:
            "Plusieurs destinations permettent une intégration plus fluide pour les profils francophones.",
        },
      ],
      ctaText: "Évaluer mon profil pour l'Europe",
      published: true,
      order: 3,
      seoTitle: "Immigration en Europe depuis le Togo | VisaCore Solutions",
      seoDescription:
        "Visa européen depuis Lomé. France, Allemagne, Belgique. Études, travail, résidence. Accompagnement personnalisé.",
    },
  })

  console.log("✅ Destinations created")

  // ─── Services ────────────────────────────────────────────
  const services = [
    {
      name: "Études à l'étranger",
      slug: "etudes-etranger",
      icon: "GraduationCap",
      description:
        "Nous vous accompagnons dans toutes les étapes de votre projet d'études à l'étranger : choix de programme, dossier d'admission, demande de visa étudiant et préparation au départ.",
      whoIsItFor:
        "Étudiants, bacheliers, professionnels en reconversion souhaitant obtenir un diplôme international.",
      requiredSupport:
        "Relevés de notes, diplômes, tests de langue (IELTS, TOEFL, TCF), lettre de motivation, preuves financières.",
      benefits: [
        {
          title: "Orientation vers les meilleurs programmes",
          description:
            "Sélection d'établissements et de parcours cohérents avec votre profil et votre budget.",
        },
        {
          title: "Aide à la rédaction du dossier",
          description:
            "Accompagnement sur la lettre de motivation, le storytelling et les pièces académiques.",
        },
        {
          title: "Préparation à l'entretien consulaire",
          description:
            "Simulation et cadrage des réponses attendues pour maximiser la crédibilité du projet.",
        },
        {
          title: "Suivi post-admission",
          description:
            "Support jusqu'à la demande de visa et à la préparation du départ.",
        },
      ],
      ctaText: "Démarrer mon projet d'études",
      order: 1,
    },
    {
      name: "Permis de travail",
      slug: "permis-travail",
      icon: "Briefcase",
      description:
        "Obtenez votre permis de travail pour exercer légalement à l'étranger. Nous identifions les programmes adaptés à votre profil et vous guidons dans les démarches.",
      whoIsItFor:
        "Professionnels qualifiés, techniciens, artisans et entrepreneurs cherchant des opportunités à l'international.",
      requiredSupport:
        "CV, lettres de recommandation, certifications professionnelles, preuves d'expérience.",
      benefits: [
        {
          title: "Analyse des programmes disponibles",
          description:
            "Identification des voies de travail pertinentes selon votre métier et votre destination.",
        },
        {
          title: "Optimisation du dossier",
          description:
            "Structuration des preuves d'expérience et des éléments qui renforcent votre employabilité.",
        },
        {
          title: "Accompagnement administratif complet",
          description:
            "Suivi des exigences documentaires et du calendrier de soumission.",
        },
        {
          title: "Conseils sur le marché du travail",
          description:
            "Orientation pragmatique sur les secteurs qui recrutent et les attentes locales.",
        },
      ],
      ctaText: "Trouver mon opportunité de travail",
      order: 2,
    },
    {
      name: "Immigration permanente",
      slug: "immigration-permanente",
      icon: "Home",
      description:
        "Réalisez votre rêve de résidence permanente à l'étranger. Nous vous guidons à travers les programmes d'immigration et optimisons vos chances de succès.",
      whoIsItFor:
        "Familles, professionnels et entrepreneurs souhaitant s'établir définitivement à l'étranger.",
      requiredSupport:
        "Documents d'état civil, preuves de fonds, évaluations de diplômes, tests de langue.",
      benefits: [
        {
          title: "Évaluation complète du profil",
          description:
            "Analyse des facteurs clés qui influencent vos chances d'admission à la résidence.",
        },
        {
          title: "Stratégie d'immigration personnalisée",
          description:
            "Choix du programme le plus pertinent selon votre situation familiale, académique et professionnelle.",
        },
        {
          title: "Montage de dossier rigoureux",
          description:
            "Préparation structurée des preuves et contrôle qualité de chaque pièce du dossier.",
        },
        {
          title: "Suivi jusqu'à l'obtention du statut",
          description:
            "Accompagnement sur toute la durée du processus jusqu'à la décision finale.",
        },
      ],
      ctaText: "Évaluer mes chances",
      order: 3,
    },
    {
      name: "Visa visiteur",
      slug: "visa-visiteur",
      icon: "Plane",
      description:
        "Préparez votre demande de visa visiteur avec confiance. Nous vous aidons à constituer un dossier solide et crédible pour maximiser vos chances d'approbation.",
      whoIsItFor:
        "Voyageurs, familles visitant des proches, professionnels en déplacement d'affaires.",
      requiredSupport:
        "Invitation, preuves de liens avec le pays d'origine, justificatifs financiers, assurance voyage.",
      benefits: [
        {
          title: "Préparation du dossier sur mesure",
          description:
            "Construction d'un dossier crédible en cohérence avec l'objet du voyage.",
        },
        {
          title: "Conseils pour l'entretien",
          description:
            "Préparation ciblée lorsque l'entretien fait partie de la procédure consulaire.",
        },
        {
          title: "Vérification complète des documents",
          description:
            "Contrôle des pièces justificatives pour limiter les refus liés aux incohérences.",
        },
        {
          title: "Taux d'approbation optimisé",
          description:
            "Amélioration de la qualité globale de la demande avant soumission.",
        },
      ],
      ctaText: "Préparer mon visa visiteur",
      order: 4,
    },
    {
      name: "Montage de dossier complet",
      slug: "montage-dossier",
      icon: "FolderCheck",
      description:
        "Un dossier bien monté est la clé du succès. Notre équipe prend en charge l'intégralité de la constitution de votre dossier d'immigration.",
      whoIsItFor:
        "Toute personne ayant besoin d'un accompagnement professionnel pour la préparation de son dossier.",
      requiredSupport:
        "Tous documents pertinents selon le type de demande.",
      benefits: [
        {
          title: "Revue complète des documents",
          description:
            "Contrôle minutieux de chaque pièce afin d'éviter les oublis et incohérences.",
        },
        {
          title: "Traduction certifiée si nécessaire",
          description:
            "Orientation sur les traductions requises et intégration propre des versions traduites.",
        },
        {
          title: "Organisation et compilation professionnelle",
          description:
            "Structuration claire du dossier pour faciliter son traitement par les autorités.",
        },
        {
          title: "Vérification de conformité",
          description:
            "Dernier contrôle qualité avant soumission officielle.",
        },
      ],
      ctaText: "Confier mon dossier à un expert",
      order: 5,
    },
    {
      name: "Consultation personnalisée",
      slug: "consultation-personnalisee",
      icon: "MessageSquare",
      description:
        "Bénéficiez d'une session de consultation individuelle avec l'un de nos experts. Nous analysons votre situation et vous proposons une stratégie claire.",
      whoIsItFor:
        "Toute personne souhaitant un avis expert sur son projet d'immigration ou de visa.",
      requiredSupport:
        "Aucun document requis au préalable. Venez avec vos questions et votre projet.",
      benefits: [
        {
          title: "Analyse personnalisée de votre situation",
          description:
            "Lecture rapide des forces, risques et blocages potentiels de votre projet.",
        },
        {
          title: "Recommandations stratégiques",
          description:
            "Priorisation des meilleures options en fonction de votre réalité et de votre budget.",
        },
        {
          title: "Plan d'action concret",
          description:
            "Feuille de route claire avec les prochaines étapes à engager immédiatement.",
        },
        {
          title: "Réponses à toutes vos questions",
          description:
            "Temps dédié pour clarifier les zones d'incertitude avant de vous engager.",
        },
      ],
      ctaText: "Réserver ma consultation",
      order: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: { ...service, published: true },
    })
  }
  console.log("✅ Services created")

  // ─── FAQs ───────────────────────────────────────────────
  const faqs = [
    {
      question: "Quels sont les délais moyens pour obtenir un visa ?",
      answer:
        "Les délais varient selon le type de visa et la destination. Pour le Canada (Entrée Express), comptez 6 à 12 mois. Pour les États-Unis, les délais varient de 2 à 8 mois selon le type de visa. Pour l'Europe, comptez 2 à 6 mois. Nous vous donnerons une estimation précise lors de votre consultation.",
      category: "GENERAL" as const,
      order: 1,
    },
    {
      question: "Combien coûtent vos services ?",
      answer:
        "Nos tarifs dépendent du type de service et de la complexité de votre dossier. Nous proposons une première évaluation gratuite pour déterminer vos besoins. Contactez-nous pour obtenir un devis personnalisé adapté à votre situation.",
      category: "GENERAL" as const,
      order: 2,
    },
    {
      question: "Comment fonctionne l'Entrée Express au Canada ?",
      answer:
        "L'Entrée Express est un système de gestion des demandes d'immigration utilisant un classement par points (CRS). Les candidats créent un profil, reçoivent un score basé sur l'âge, l'éducation, l'expérience et la maîtrise linguistique, puis les mieux classés reçoivent une invitation à présenter une demande de résidence permanente.",
      category: "CANADA" as const,
      order: 3,
    },
    {
      question: "Qu'est-ce que la DV Lottery américaine ?",
      answer:
        "La DV Lottery (Diversity Visa Lottery) est un programme annuel du gouvernement américain qui offre environ 55 000 Green Cards par tirage au sort aux ressortissants de pays à faible taux d'immigration vers les États-Unis. L'inscription est gratuite et se fait en ligne chaque année.",
      category: "USA" as const,
      order: 4,
    },
    {
      question: "Puis-je travailler en Europe avec un visa étudiant ?",
      answer:
        "Oui, dans la plupart des pays européens, les étudiants internationaux peuvent travailler à temps partiel (généralement 20h/semaine). Les conditions varient selon le pays. En France par exemple, vous pouvez travailler jusqu'à 964 heures par an avec un visa étudiant.",
      category: "EUROPE" as const,
      order: 5,
    },
    {
      question: "Quels documents sont généralement nécessaires ?",
      answer:
        "Les documents de base incluent : passeport valide, photos d'identité, actes d'état civil, diplômes, relevés de notes, preuves financières, certificats de langue, lettres de recommandation et CV. La liste exacte dépend du type de visa et de la destination.",
      category: "DOCUMENTATION" as const,
      order: 6,
    },
    {
      question: "Comment se déroule une consultation chez VisaCore ?",
      answer:
        "La consultation commence par une évaluation gratuite de votre profil. Ensuite, nous organisons une session approfondie où nous analysons votre situation, identifions les meilleures options et établissons un plan d'action. Vous repartez avec une feuille de route claire pour votre projet.",
      category: "PROCESS" as const,
      order: 7,
    },
    {
      question: "Proposez-vous des facilités de paiement ?",
      answer:
        "Oui, nous proposons des plans de paiement flexibles pour rendre nos services accessibles. Vous pouvez régler en plusieurs versements selon un échéancier convenu. Contactez-nous pour discuter des options de paiement adaptées à votre budget.",
      category: "GENERAL" as const,
      order: 8,
    },
  ]

  for (let i = 0; i < faqs.length; i++) {
    await prisma.fAQ.create({
      data: { ...faqs[i], published: true },
    })
  }
  console.log("✅ FAQs created")

  // ─── Testimonials ────────────────────────────────────────
  const testimonials = [
    {
      clientName: "Kofi Mensah",
      destination: "Canada",
      destinationId: canada.id,
      content:
        "Grâce à VisaCore Solutions, j'ai obtenu ma résidence permanente au Canada en seulement 8 mois via Entrée Express. Leur équipe m'a guidé à chaque étape avec un professionnalisme remarquable. Je recommande vivement leurs services !",
      rating: 5,
      featured: true,
    },
    {
      clientName: "Amina Diallo",
      destination: "France",
      destinationId: europe.id,
      content:
        "J'ai été admise à l'Université Paris-Saclay grâce à l'accompagnement de VisaCore. Ils ont géré mon dossier Campus France et ma demande de visa avec une efficacité incroyable. Merci pour tout !",
      rating: 5,
      featured: true,
    },
    {
      clientName: "Emmanuel Adeyemi",
      destination: "États-Unis",
      destinationId: usa.id,
      content:
        "Mon visa H-1B a été approuvé du premier coup ! L'équipe de VisaCore a préparé un dossier impeccable et m'a préparé pour l'entretien. Un service de qualité internationale.",
      rating: 5,
      featured: true,
    },
    {
      clientName: "Fatoumata Traoré",
      destination: "Canada",
      destinationId: canada.id,
      content:
        "VisaCore m'a aidée à obtenir mon permis d'études pour le Collège Algonquin à Ottawa. Le processus était fluide et transparent. Je suis maintenant en route vers mon diplôme canadien !",
      rating: 5,
      featured: false,
    },
    {
      clientName: "Jean-Pierre Kouassi",
      destination: "Allemagne",
      destinationId: europe.id,
      content:
        "Excellent accompagnement pour mon visa de travail en Allemagne. L'équipe connaît parfaitement les exigences et m'a évité de nombreuses erreurs. Service professionnel et humain.",
      rating: 4,
      featured: false,
    },
    {
      clientName: "Afi Lawson",
      destination: "Canada",
      destinationId: canada.id,
      content:
        "Notre famille a obtenu la résidence permanente grâce au programme provincial du Manitoba. VisaCore nous a accompagnés pendant tout le processus avec patience et expertise.",
      rating: 5,
      featured: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: { ...testimonial, published: true },
    })
  }
  console.log("✅ Testimonials created")

  // ─── Success Stories ─────────────────────────────────────
  const stories = [
    {
      title: "De Lomé à Toronto : le parcours de Kofi",
      slug: "kofi-lome-toronto",
      clientName: "Kofi Mensah",
      destination: "Canada",
      summary:
        "Kofi, ingénieur en informatique basé à Lomé, rêvait de travailler au Canada. Grâce à Entrée Express et l'accompagnement de VisaCore, il a obtenu sa résidence permanente en 8 mois.",
      content:
        "Kofi Mensah, ingénieur en informatique avec 5 ans d'expérience, a contacté VisaCore Solutions avec un objectif clair : s'installer au Canada. Après une évaluation approfondie de son profil, nous avons identifié Entrée Express comme la voie la plus rapide. Nous l'avons aidé à passer l'IELTS (score 7.5), faire évaluer ses diplômes par WES, et optimiser son profil CRS. Résultat : une invitation à présenter sa demande en seulement 3 mois, et sa résidence permanente 5 mois plus tard. Kofi travaille aujourd'hui chez une grande entreprise tech à Toronto.",
      published: true,
    },
    {
      title: "Amina réalise son rêve d'études en France",
      slug: "amina-etudes-france",
      clientName: "Amina Diallo",
      destination: "France",
      summary:
        "Étudiante brillante en sciences, Amina a été accompagnée par VisaCore pour intégrer l'Université Paris-Saclay avec une bourse d'études.",
      content:
        "Amina Diallo, major de sa promotion en biochimie à l'Université de Lomé, souhaitait poursuivre ses études en France. VisaCore l'a accompagnée dans toute la procédure Campus France, la rédaction de sa lettre de motivation, et la constitution de son dossier de visa. Nous l'avons également aidée à obtenir une bourse du gouvernement français. Aujourd'hui, Amina est en Master 2 à Paris-Saclay et envisage un doctorat.",
      published: true,
    },
    {
      title: "Yaw décroche un permis de travail au Québec",
      slug: "yaw-permis-travail-quebec",
      clientName: "Yaw Agbeko",
      destination: "Canada",
      summary:
        "Après plusieurs refus informels auprès d'employeurs, Yaw a structuré son dossier avec VisaCore et obtenu un permis de travail fermé pour rejoindre une entreprise logistique au Québec.",
      content:
        "Yaw Agbeko travaillait déjà dans la chaîne logistique à Lomé, mais ses candidatures vers le Canada n'aboutissaient pas faute de stratégie claire. VisaCore a revu son CV au format canadien, préparé sa documentation professionnelle et coordonné les étapes liées à l'offre d'emploi et au dossier de permis de travail. Nous l'avons également préparé à l'entretien employeur et au dépôt biométrique. En moins de six mois, Yaw a obtenu son visa et a rejoint son poste au Québec avec un plan précis pour faire venir sa famille plus tard.",
      published: true,
    },
    {
      title: "Grâce trouve une voie d'installation en Belgique",
      slug: "grace-installation-belgique",
      clientName: "Grâce Kossivi",
      destination: "Belgique",
      summary:
        "Avec un projet familial et professionnel à clarifier, Grâce a bénéficié d'un accompagnement structuré pour bâtir un dossier solide vers la Belgique.",
      content:
        "Grâce Kossivi hésitait entre plusieurs options européennes et ne savait pas quel parcours serait le plus cohérent avec son profil d'assistante administrative expérimentée. Après un diagnostic complet, VisaCore a retenu la Belgique comme destination cible et a réorganisé tout son dossier autour de son expérience, de ses justificatifs financiers et de son projet d'installation. Nous avons assuré les relectures, la cohérence narrative et le suivi des pièces demandées jusqu'à la décision finale. Grâce vit désormais à Bruxelles et suit un plan d'intégration progressive combinant emploi, formation linguistique et stabilité familiale.",
      published: true,
    },
  ]

  for (const story of stories) {
    await prisma.successStory.upsert({
      where: { slug: story.slug },
      update: story,
      create: story,
    })
  }
  console.log("✅ Success stories created")

  // ─── Page Content ────────────────────────────────────────
  const pageContents = [
    {
      pageKey: "home",
      sectionKey: "hero",
      title: "Votre avenir à l'international commence ici",
      subtitle: "Experts en immigration vers le Canada, les États-Unis et l'Europe",
      content: {
        eyebrow: "Expertise Mondiale • Service Local",
        primaryCta: "Obtenir mon évaluation gratuite",
        secondaryCta: "Prendre rendez-vous",
      },
    },
    {
      pageKey: "home",
      sectionKey: "trust",
      title: "Pourquoi nous faire confiance",
      subtitle: "Des résultats concrets, suivis de près par notre équipe.",
      content: {
        stats: [
          { value: "+1000", label: "Dossiers accompagnés" },
          { value: "95%", label: "Taux de réussite" },
          { value: "10+", label: "Années d'expérience" },
        ],
      },
    },
    {
      pageKey: "about",
      sectionKey: "story",
      title: "Notre histoire",
      subtitle: "Une histoire locale portée par une ambition internationale.",
      content: {
        text: "Fondée à Lomé, Togo, VisaCore Solutions est née de la conviction que chaque personne mérite un accès équitable aux opportunités internationales. Notre équipe de consultants expérimentés combine expertise locale et connaissance approfondie des systèmes d'immigration mondiaux pour offrir un accompagnement de qualité supérieure.",
      },
    },
    {
      pageKey: "about",
      sectionKey: "mission",
      title: "Notre mission",
      content: {
        text: "Faciliter l'accès aux opportunités internationales pour les Africains en offrant un accompagnement professionnel, transparent et humain dans toutes les démarches d'immigration.",
      },
    },
    {
      pageKey: "about",
      sectionKey: "vision",
      title: "Notre vision",
      content: {
        text: "Devenir le partenaire de référence en immigration pour l'Afrique de l'Ouest, reconnu pour l'excellence de son accompagnement et le succès de ses clients.",
      },
    },
  ]

  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: content.pageKey,
          sectionKey: content.sectionKey,
        },
      },
      update: {},
      create: content,
    })
  }
  console.log("✅ Page content created")

  // ─── Site Settings ───────────────────────────────────────
  const settings = [
    ...publicSiteSettingCatalog,
    ...notificationSiteSettingCatalog,
  ].map((setting) => ({
    key: setting.key,
    value: setting.defaultValue,
    type: setting.type,
  }))

  const seededSettingOverrides = {
    facebook_url: "https://facebook.com/visacoresolutions",
    linkedin_url: "https://linkedin.com/company/visacoresolutions",
    instagram_url: "https://instagram.com/visacoresolutions",
  } as const

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        ...setting,
        value:
          seededSettingOverrides[
            setting.key as keyof typeof seededSettingOverrides
          ] ?? setting.value,
      },
    })
  }
  console.log("✅ Site settings created")

  // ─── Sample Leads ───────────────────────────────────────
  const leads = [
    {
      fullName: "Kodjo Agbeko",
      email: "kodjo.agbeko@email.com",
      phone: "+228 91 23 45 67",
      country: "Togo",
      destination: "Canada",
      situation: "Ingénieur civil avec 3 ans d'expérience",
      serviceNeeded: "Immigration permanente",
      message: "Je souhaite immigrer au Canada via Entrée Express. Pouvez-vous m'aider ?",
      consent: true,
      status: "NEW" as const,
      source: "website",
    },
    {
      fullName: "Akossiwa Mensah",
      email: "akossiwa.m@email.com",
      phone: "+228 92 34 56 78",
      country: "Togo",
      destination: "France",
      situation: "Étudiante en Master 1 Droit",
      serviceNeeded: "Études à l'étranger",
      message: "Je cherche à poursuivre mon Master 2 en France. Besoin d'aide pour Campus France.",
      consent: true,
      status: "CONTACTED" as const,
      source: "referral",
    },
    {
      fullName: "Yao Dzigbodi",
      email: "yao.dz@email.com",
      phone: "+228 93 45 67 89",
      country: "Ghana",
      destination: "États-Unis",
      situation: "Développeur logiciel senior",
      serviceNeeded: "Permis de travail",
      message: "Intéressé par un visa H-1B pour les États-Unis.",
      consent: true,
      status: "QUALIFIED" as const,
      source: "website",
    },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }
  console.log("✅ Sample leads created")

  // ─── Sample Contact Requests ─────────────────────────────
  await prisma.contactRequest.create({
    data: {
      fullName: "Marie Eklu",
      email: "marie.eklu@email.com",
      phone: "+228 94 56 78 90",
      subject: "Information sur les tarifs",
      message:
        "Bonjour, je souhaiterais connaître vos tarifs pour un accompagnement complet vers le Canada. Merci.",
    },
  })
  console.log("✅ Sample contact request created")

  // ─── Sample Appointment ──────────────────────────────────
  await prisma.appointmentRequest.create({
    data: {
      fullName: "Kwame Asante",
      email: "kwame.asante@email.com",
      phone: "+228 95 67 89 01",
      preferredDate: new Date("2026-04-05"),
      preferredTime: "10:00",
      serviceType: "Consultation personnalisée",
      destinationType: "Canada",
      message: "Je souhaite une consultation pour discuter de mes options d'immigration.",
      status: "PENDING",
    },
  })
  console.log("✅ Sample appointment created")

  console.log("\n🎉 Database seeded successfully!")
  console.log("📧 Admin login: admin@visacore.com / VisaCore2024!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
