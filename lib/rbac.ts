type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR"
type Action = "create" | "edit" | "delete" | "manage_users" | "manage_settings" | "view_all"

const permissions: Record<Role, Action[]> = {
  SUPER_ADMIN: ["create", "edit", "delete", "manage_users", "manage_settings", "view_all"],
  ADMIN: ["create", "edit", "delete", "view_all"],
  EDITOR: ["create", "edit", "view_all"],
}

export function hasPermission(role: string | undefined, action: Action): boolean {
  if (!role) return false
  return permissions[role as Role]?.includes(action) ?? false
}
