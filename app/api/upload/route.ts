import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasPermission } from "@/lib/rbac"
import fs from "fs/promises"
import path from "path"
import { validateUploadFileMetadata } from "@/lib/upload-policy.shared"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || !hasPermission(session.user.role, "create")) {
      return NextResponse.json(
        { success: false, error: "Non autorise" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    const validation = validateUploadFileMetadata({
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const uploadsDir = path.join(process.cwd(), "public/uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${validation.sanitizedBase}${validation.extension}`
    const filepath = path.join(uploadsDir, uniqueName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    const url = `/uploads/${uniqueName}`

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      url,
      id: mediaAsset.id,
    })
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors du telechargement" },
      { status: 500 }
    )
  }
}
