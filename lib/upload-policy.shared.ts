import path from "path"

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024

export const uploadPolicy = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
} as const

export const uploadPolicyNotice =
  "Les fichiers telecharges sont publies sur /uploads et doivent rester limites a des visuels marketing ou PDF non sensibles."

export function sanitizeUploadBasename(filename: string) {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
}

export function validateUploadFileMetadata(input: {
  name: string
  type: string
  size: number
}) {
  if (input.size > MAX_UPLOAD_SIZE) {
    return {
      success: false as const,
      error: "Le fichier depasse 5 Mo",
    }
  }

  const allowedExtensions =
    uploadPolicy[input.type as keyof typeof uploadPolicy]

  if (!allowedExtensions) {
    return {
      success: false as const,
      error:
        "Type de fichier non autorise. Formats acceptes : JPEG, PNG, WebP, GIF, PDF",
    }
  }

  const extension = path.extname(input.name).toLowerCase()

  if (!allowedExtensions.includes(extension as never)) {
    return {
      success: false as const,
      error:
        "L'extension du fichier ne correspond pas au type annonce. Renommez le fichier avec une extension valide puis reessayez.",
    }
  }

  const sanitizedBase = sanitizeUploadBasename(input.name)

  return {
    success: true as const,
    extension,
    sanitizedBase: sanitizedBase || "upload",
  }
}
