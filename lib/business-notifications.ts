import type { AppointmentStatus, Role } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { issueAccountAccessToken } from "@/lib/account-access"
import {
  createAdminNotification,
  getUsersByRoles,
} from "@/lib/admin-notifications"
import { sendTransactionalEmail } from "@/lib/email"
import {
  buildAccountInvitationEmail,
  buildAppointmentAcknowledgementEmail,
  buildAppointmentAdminAlertEmail,
  buildAppointmentStatusEmail,
  buildContactAcknowledgementEmail,
  buildContactAdminAlertEmail,
  buildLeadAcknowledgementEmail,
  buildLeadAdminAlertEmail,
  buildLeadAssignmentEmail,
  buildPasswordResetEmail,
  buildPrivacyRequestAcknowledgementEmail,
  buildPrivacyRequestAdminAlertEmail,
} from "@/lib/email-templates"
import { formatDataPrivacyRequestType } from "@/lib/privacy-requests.shared"
import {
  formatDisplayPhoneNumber,
  getNotificationSiteConfig,
  getPublicSiteConfig,
} from "@/lib/site-config"

const adminRoles: Role[] = ["SUPER_ADMIN", "ADMIN"]

function uniqueEmails(emails: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      emails
        .map((value) => value?.trim().toLowerCase())
        .filter((value): value is string => Boolean(value))
    )
  )
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

function formatFromAddress(name: string, email: string) {
  return `${name} <${email}>`
}

function formatPreferredDate(value: Date | null | undefined) {
  if (!value) return null

  return value.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTimeLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " à " +
    date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
}

async function getNotificationRuntime() {
  const [siteConfig, notificationConfig] = await Promise.all([
    getPublicSiteConfig(),
    getNotificationSiteConfig(),
  ])

  return {
    siteConfig,
    notificationConfig,
    baseUrl: getBaseUrl(),
    from: formatFromAddress(
      notificationConfig.fromName || siteConfig.siteName,
      notificationConfig.fromEmail || siteConfig.contactEmail
    ),
    replyTo:
      notificationConfig.replyToEmail ||
      siteConfig.contactEmail ||
      undefined,
  }
}

async function getAdminEmailRecipients(explicitEmails: string[]) {
  if (explicitEmails.length > 0) {
    return explicitEmails
  }

  const users = await getUsersByRoles(adminRoles)
  return uniqueEmails(users.map((user) => user.email))
}

async function deliverEmailWithRuntime(
  runtime: Awaited<ReturnType<typeof getNotificationRuntime>>,
  {
    to,
    subject,
    html,
    text,
  }: {
    to: string[]
    subject: string
    html: string
    text: string
  }
) {
  if (!runtime.notificationConfig.emailNotificationsEnabled) {
    return {
      ok: false,
      skipped: true,
      reason: "Email notifications disabled in settings",
    }
  }

  return sendTransactionalEmail({
    from: runtime.from,
    to,
    subject,
    html,
    text,
    replyTo: runtime.replyTo,
  })
}

export async function notifyLeadCreated(lead: {
  id: string
  fullName: string
  email: string
  phone: string
  destination: string
  serviceNeeded?: string | null
}) {
  try {
    const runtime = await getNotificationRuntime()
    const adminPath = `/admin/leads/${lead.id}`
    const adminUrl = `${runtime.baseUrl}${adminPath}`

    await createAdminNotification({
      type: "LEAD_CREATED",
      title: `Nouveau lead: ${lead.fullName}`,
      message: `Projet ${lead.destination}. Revenir vers le prospect sous 24h ouvrées.`,
      entityType: "lead",
      entityId: lead.id,
      actionUrl: adminPath,
      metadata: {
        destination: lead.destination,
        email: lead.email,
      },
    })

    const leadEmail = buildLeadAcknowledgementEmail({
      fullName: lead.fullName,
      destination: lead.destination,
      serviceNeeded: lead.serviceNeeded,
      siteConfig: runtime.siteConfig,
    })

    const adminEmail = buildLeadAdminAlertEmail({
      fullName: lead.fullName,
      destination: lead.destination,
      serviceNeeded: lead.serviceNeeded,
      email: lead.email,
      phone: formatDisplayPhoneNumber(lead.phone),
      adminUrl,
      siteConfig: runtime.siteConfig,
    })

    const adminRecipients = await getAdminEmailRecipients(
      runtime.notificationConfig.adminEmails
    )

    await Promise.all([
      deliverEmailWithRuntime(runtime, {
        to: [lead.email],
        subject: leadEmail.subject,
        html: leadEmail.html,
        text: leadEmail.text,
      }),
      deliverEmailWithRuntime(runtime, {
        to: adminRecipients,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    ])
  } catch (error) {
    console.error("[NOTIFY_LEAD_CREATED_ERROR]", error)
  }
}

export async function notifyContactCreated(contact: {
  id: string
  fullName: string
  email: string
  phone?: string | null
  subject: string
}) {
  try {
    const runtime = await getNotificationRuntime()
    const adminPath = "/admin/contacts"
    const adminUrl = `${runtime.baseUrl}${adminPath}`

    await createAdminNotification({
      type: "CONTACT_CREATED",
      title: `Nouveau message: ${contact.fullName}`,
      message: `Sujet: ${contact.subject}. Un conseiller doit qualifier et répondre à cette demande.`,
      entityType: "contact_request",
      entityId: contact.id,
      actionUrl: adminPath,
      metadata: {
        email: contact.email,
        subject: contact.subject,
      },
    })

    const userEmail = buildContactAcknowledgementEmail({
      fullName: contact.fullName,
      subjectLine: contact.subject,
      siteConfig: runtime.siteConfig,
    })

    const adminEmail = buildContactAdminAlertEmail({
      fullName: contact.fullName,
      subjectLine: contact.subject,
      email: contact.email,
      phone: contact.phone,
      adminUrl,
      siteConfig: runtime.siteConfig,
    })

    const adminRecipients = await getAdminEmailRecipients(
      runtime.notificationConfig.adminEmails
    )

    await Promise.all([
      deliverEmailWithRuntime(runtime, {
        to: [contact.email],
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
      }),
      deliverEmailWithRuntime(runtime, {
        to: adminRecipients,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    ])
  } catch (error) {
    console.error("[NOTIFY_CONTACT_CREATED_ERROR]", error)
  }
}

export async function notifyPrivacyRequestCreated(request: {
  id: string
  fullName: string
  email: string
  phone?: string | null
  requestType: string
}) {
  try {
    const runtime = await getNotificationRuntime()
    const adminPath = "/admin/privacy-requests"
    const adminUrl = `${runtime.baseUrl}${adminPath}`
    const requestTypeLabel = formatDataPrivacyRequestType(request.requestType)

    await createAdminNotification({
      type: "PRIVACY_REQUEST_CREATED",
      title: `Nouvelle demande RGPD: ${request.fullName}`,
      message: `${requestTypeLabel}. Verification d'identite et traitement a enclencher dans le delai RGPD.`,
      entityType: "data_privacy_request",
      entityId: request.id,
      actionUrl: adminPath,
      metadata: {
        email: request.email,
        requestType: request.requestType,
      },
    })

    const userEmail = buildPrivacyRequestAcknowledgementEmail({
      fullName: request.fullName,
      requestTypeLabel,
      siteConfig: runtime.siteConfig,
    })

    const adminEmail = buildPrivacyRequestAdminAlertEmail({
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      requestTypeLabel,
      adminUrl,
      siteConfig: runtime.siteConfig,
    })

    const adminRecipients = await getAdminEmailRecipients(
      runtime.notificationConfig.adminEmails
    )

    await Promise.all([
      deliverEmailWithRuntime(runtime, {
        to: [request.email],
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
      }),
      deliverEmailWithRuntime(runtime, {
        to: adminRecipients,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    ])
  } catch (error) {
    console.error("[NOTIFY_PRIVACY_REQUEST_CREATED_ERROR]", error)
  }
}

export async function notifyAppointmentCreated(appointment: {
  id: string
  fullName: string
  email: string
  phone: string
  preferredDate?: Date | null
  preferredTime?: string | null
  serviceType?: string | null
  destinationType?: string | null
}) {
  try {
    const runtime = await getNotificationRuntime()
    const adminPath = "/admin/appointments"
    const adminUrl = `${runtime.baseUrl}${adminPath}`
    const preferredDate = formatPreferredDate(appointment.preferredDate)

    await createAdminNotification({
      type: "APPOINTMENT_CREATED",
      title: `Nouvelle demande de rendez-vous: ${appointment.fullName}`,
      message: "Une nouvelle demande de rendez-vous attend une validation d'équipe.",
      entityType: "appointment_request",
      entityId: appointment.id,
      actionUrl: adminPath,
      metadata: {
        email: appointment.email,
        preferredDate,
      },
    })

    const userEmail = buildAppointmentAcknowledgementEmail({
      fullName: appointment.fullName,
      preferredDate,
      preferredTime: appointment.preferredTime,
      serviceType: appointment.serviceType,
      destinationType: appointment.destinationType,
      siteConfig: runtime.siteConfig,
    })

    const adminEmail = buildAppointmentAdminAlertEmail({
      fullName: appointment.fullName,
      email: appointment.email,
      phone: formatDisplayPhoneNumber(appointment.phone),
      preferredDate,
      preferredTime: appointment.preferredTime,
      serviceType: appointment.serviceType,
      adminUrl,
      siteConfig: runtime.siteConfig,
    })

    const adminRecipients = await getAdminEmailRecipients(
      runtime.notificationConfig.adminEmails
    )

    await Promise.all([
      deliverEmailWithRuntime(runtime, {
        to: [appointment.email],
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
      }),
      deliverEmailWithRuntime(runtime, {
        to: adminRecipients,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    ])
  } catch (error) {
    console.error("[NOTIFY_APPOINTMENT_CREATED_ERROR]", error)
  }
}

export async function notifyAppointmentStatusChanged(appointment: {
  id: string
  fullName: string
  email: string
  preferredDate?: Date | null
  preferredTime?: string | null
  assignedToId?: string | null
  status: AppointmentStatus
}) {
  try {
    const runtime = await getNotificationRuntime()
    const preferredDate = formatPreferredDate(appointment.preferredDate)

    const statusDetails: Record<
      AppointmentStatus,
      { label: string; message: string; type: "APPOINTMENT_APPROVED" | "APPOINTMENT_CANCELLED" | "APPOINTMENT_COMPLETED" }
    > = {
      PENDING: {
        label: "En attente",
        message:
          "votre demande est toujours en cours d'analyse par notre equipe.",
        type: "APPOINTMENT_APPROVED",
      },
      APPROVED: {
        label: "Approuve",
        message:
          "votre rendez-vous est confirme. Notre equipe reste disponible pour tout ajustement organisationnel.",
        type: "APPOINTMENT_APPROVED",
      },
      CANCELLED: {
        label: "Annule",
        message:
          "votre rendez-vous a ete annule. Merci de recontacter notre equipe pour convenir d'une nouvelle disponibilite.",
        type: "APPOINTMENT_CANCELLED",
      },
      COMPLETED: {
        label: "Termine",
        message:
          "votre rendez-vous est marque comme termine. Nous restons disponibles pour les suites de votre dossier.",
        type: "APPOINTMENT_COMPLETED",
      },
    }

    if (appointment.status === "PENDING") {
      return
    }

    const details = statusDetails[appointment.status]
    const adminRecipients = appointment.assignedToId
      ? [appointment.assignedToId]
      : undefined

    await createAdminNotification({
      type: details.type,
      title: `Rendez-vous ${details.label.toLowerCase()}: ${appointment.fullName}`,
      message: `Le statut du rendez-vous a ete passe a ${details.label.toLowerCase()}.`,
      entityType: "appointment_request",
      entityId: appointment.id,
      actionUrl: "/admin/appointments",
      recipientUserIds: adminRecipients,
    })

    const customerEmail = buildAppointmentStatusEmail({
      fullName: appointment.fullName,
      statusLabel: details.label,
      preferredDate,
      preferredTime: appointment.preferredTime,
      message: details.message,
      siteConfig: runtime.siteConfig,
    })

    await deliverEmailWithRuntime(runtime, {
      to: [appointment.email],
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    })
  } catch (error) {
    console.error("[NOTIFY_APPOINTMENT_STATUS_CHANGED_ERROR]", error)
  }
}

export async function notifyLeadAssigned(assignment: {
  leadId: string
  leadName: string
  destination: string
  assignedToId: string
}) {
  try {
    const runtime = await getNotificationRuntime()
    const assignee = await prisma.user.findUnique({
      where: { id: assignment.assignedToId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!assignee?.email) {
      return
    }

    const adminPath = `/admin/leads/${assignment.leadId}`
    const adminUrl = `${runtime.baseUrl}${adminPath}`

    await createAdminNotification({
      type: "LEAD_ASSIGNED",
      title: `Lead assigne: ${assignment.leadName}`,
      message: `Le lead ${assignment.leadName} vous a ete attribue pour traitement.`,
      entityType: "lead",
      entityId: assignment.leadId,
      actionUrl: adminPath,
      recipientUserIds: [assignee.id],
      metadata: {
        destination: assignment.destination,
      },
    })

    const assignmentEmail = buildLeadAssignmentEmail({
      assigneeName: assignee.name ?? "Equipe",
      leadName: assignment.leadName,
      destination: assignment.destination,
      adminUrl,
      siteConfig: runtime.siteConfig,
    })

    await deliverEmailWithRuntime(runtime, {
      to: [assignee.email],
      subject: assignmentEmail.subject,
      html: assignmentEmail.html,
      text: assignmentEmail.text,
    })
  } catch (error) {
    console.error("[NOTIFY_LEAD_ASSIGNED_ERROR]", error)
  }
}

export async function notifyUserCreated(user: {
  id: string
  name?: string | null
  email: string
  role: Role
  createdByName?: string | null
}) {
  try {
    const runtime = await getNotificationRuntime()
    const { rawToken, expires } = await issueAccountAccessToken(
      user.email,
      "invite"
    )
    const setupUrl = `${runtime.baseUrl}/configurer-acces?token=${rawToken}`

    await createAdminNotification({
      type: "USER_CREATED",
      title: `Nouvel utilisateur: ${user.email}`,
      message: `Un compte ${user.role.toLowerCase()} a ete cree et une invitation securisee a ete envoyee.`,
      entityType: "user",
      entityId: user.id,
      actionUrl: "/admin/users",
      recipientRoles: adminRoles,
      metadata: {
        role: user.role,
      },
    })

    const roleLabels: Record<Role, string> = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Administrateur",
      EDITOR: "Editeur",
    }

    const invitationEmail = buildAccountInvitationEmail({
      userName: user.name || user.email,
      roleLabel: roleLabels[user.role],
      accessUrl: setupUrl,
      expiresLabel: formatDateTimeLabel(expires),
      createdByName: user.createdByName,
      siteConfig: runtime.siteConfig,
    })

    await deliverEmailWithRuntime(runtime, {
      to: [user.email],
      subject: invitationEmail.subject,
      html: invitationEmail.html,
      text: invitationEmail.text,
    })
  } catch (error) {
    console.error("[NOTIFY_USER_CREATED_ERROR]", error)
  }
}

export async function sendAccountInvitationEmail(user: {
  name?: string | null
  email: string
  role: Role
  createdByName?: string | null
}) {
  try {
    const runtime = await getNotificationRuntime()
    const { rawToken, expires } = await issueAccountAccessToken(
      user.email,
      "invite"
    )
    const setupUrl = `${runtime.baseUrl}/configurer-acces?token=${rawToken}`

    const roleLabels: Record<Role, string> = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Administrateur",
      EDITOR: "Editeur",
    }

    const invitationEmail = buildAccountInvitationEmail({
      userName: user.name || user.email,
      roleLabel: roleLabels[user.role],
      accessUrl: setupUrl,
      expiresLabel: formatDateTimeLabel(expires),
      createdByName: user.createdByName,
      siteConfig: runtime.siteConfig,
    })

    await deliverEmailWithRuntime(runtime, {
      to: [user.email],
      subject: invitationEmail.subject,
      html: invitationEmail.html,
      text: invitationEmail.text,
    })
  } catch (error) {
    console.error("[SEND_ACCOUNT_INVITATION_EMAIL_ERROR]", error)
  }
}

export async function sendPasswordResetEmail(user: {
  name?: string | null
  email: string
}) {
  try {
    const runtime = await getNotificationRuntime()
    const { rawToken, expires } = await issueAccountAccessToken(
      user.email,
      "reset"
    )
    const resetUrl = `${runtime.baseUrl}/configurer-acces?token=${rawToken}&mode=reset`

    const resetEmail = buildPasswordResetEmail({
      userName: user.name || user.email,
      accessUrl: resetUrl,
      expiresLabel: formatDateTimeLabel(expires),
      siteConfig: runtime.siteConfig,
    })

    await deliverEmailWithRuntime(runtime, {
      to: [user.email],
      subject: resetEmail.subject,
      html: resetEmail.html,
      text: resetEmail.text,
    })
  } catch (error) {
    console.error("[SEND_PASSWORD_RESET_EMAIL_ERROR]", error)
  }
}
