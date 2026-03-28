import { prisma } from "@/lib/prisma"
import { isApplicantRole } from "@/lib/applicant-portal.shared"

export function normalizeOptionalDateInput(value: string | undefined | null) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function buildApplicantCaseReference() {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "")
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `VCS-${datePart}-${randomPart}`
}

export async function getApplicantPortalRecord(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      applicantProfile: true,
      applicantCases: {
        orderBy: [{ updatedAt: "desc" }],
        include: {
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          milestones: {
            orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
          },
          checklistItems: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            include: {
              documents: {
                orderBy: { createdAt: "desc" },
              },
            },
          },
          documents: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })

  if (!user || !isApplicantRole(user.role)) {
    return null
  }

  return user
}

export async function getApplicantAdminRecord(applicantId: string) {
  return prisma.user.findFirst({
    where: {
      id: applicantId,
      role: "APPLICANT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      hashedPassword: true,
      createdAt: true,
      applicantProfile: true,
      applicantCases: {
        orderBy: [{ updatedAt: "desc" }],
        include: {
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          milestones: {
            orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
          },
          checklistItems: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            include: {
              documents: {
                orderBy: { createdAt: "desc" },
              },
            },
          },
          documents: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })
}
