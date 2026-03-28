import { isApplicantRole } from "@/lib/applicant-portal.shared"

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "APPLICANT"
export type Action =
  | "create"
  | "edit"
  | "delete"
  | "manage_users"
  | "manage_applicants"
  | "manage_settings"
  | "view_all"

const permissions: Record<Role, Action[]> = {
  SUPER_ADMIN: ["create", "edit", "delete", "manage_users", "manage_applicants", "manage_settings", "view_all"],
  ADMIN: ["create", "edit", "delete", "manage_applicants", "view_all"],
  EDITOR: ["create", "edit", "view_all"],
  APPLICANT: [],
}

export function hasPermission(role: string | undefined, action: Action): boolean {
  if (!role) return false
  return permissions[role as Role]?.includes(action) ?? false
}

export function canAccessAdminPath(
  pathname: string,
  role: string | undefined
): boolean {
  if (!role) return false
  if (isApplicantRole(role)) return false

  if (pathname.startsWith("/admin/users")) {
    return hasPermission(role, "manage_users")
  }

  if (pathname.startsWith("/admin/applicants")) {
    return hasPermission(role, "manage_applicants")
  }

  if (pathname.startsWith("/admin/settings")) {
    return hasPermission(role, "manage_settings")
  }

  if (pathname.startsWith("/admin/privacy-requests")) {
    return hasPermission(role, "manage_settings")
  }

  return true
}

export function canRenderAdminNavItem(
  role: string | undefined,
  requiredAction?: Action
): boolean {
  if (!role) return false
  return requiredAction ? hasPermission(role, requiredAction) : true
}

export function canAccessApplicantPortal(role: string | undefined) {
  return isApplicantRole(role)
}
