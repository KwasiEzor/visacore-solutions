"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"
import { hasPermission } from "@/lib/rbac"

export async function deleteMedia(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorise" }
    }

    const media = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!media) return { success: false, error: "Media introuvable" }

    // Delete file from disk
    const filepath = path.join(process.cwd(), "public", media.url)
    try {
      await fs.unlink(filepath)
    } catch {
      /* file may not exist */
    }

    await prisma.mediaAsset.delete({ where: { id } })
    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_MEDIA_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le media" }
  }
}
