import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import fs from "fs/promises"
import path from "path"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
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

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Le fichier depasse 5 Mo" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Type de fichier non autorise. Formats acceptes : JPEG, PNG, WebP, GIF, PDF",
        },
        { status: 400 }
      )
    }

    const uploadsDir = path.join(process.cwd(), "public/uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
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
