import fs from "node:fs/promises"
import path from "node:path"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isApplicantRole } from "@/lib/applicant-portal.shared"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Non autorise", { status: 401 })
  }

  const { id } = await params
  const document = await prisma.applicantDocument.findUnique({
    where: { id },
    select: {
      applicantId: true,
      originalFilename: true,
      storagePath: true,
      mimeType: true,
    },
  })

  if (!document) {
    return new Response("Document introuvable", { status: 404 })
  }

  if (isApplicantRole(session.user.role) && document.applicantId !== session.user.id) {
    return new Response("Acces refuse", { status: 403 })
  }

  const resolvedPath = path.resolve(document.storagePath)
  try {
    const buffer = await fs.readFile(resolvedPath)
    return new Response(buffer, {
      headers: {
        "Content-Type": document.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(
          document.originalFilename
        )}"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("[APPLICANT_DOCUMENT_READ_ERROR]", error)
    return new Response("Document indisponible", { status: 404 })
  }
}
