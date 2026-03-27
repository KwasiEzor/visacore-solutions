export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR"
export type Action =
  | "create"
  | "edit"
  | "delete"
  | "manage_users"
  | "manage_settings"
  | "view_all"

const permissions: Record<Role, Action[]> = {
  SUPER_ADMIN: ["create", "edit", "delete", "manage_users", "manage_settings", "view_all"],
  ADMIN: ["create", "edit", "delete", "view_all"],
  EDITOR: ["create", "edit", "view_all"],
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

  if (pathname.startsWith("/admin/users")) {
    return hasPermission(role, "manage_users")
  }

  if (pathname.startsWith("/admin/settings")) {
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
