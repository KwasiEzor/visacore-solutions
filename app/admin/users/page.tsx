import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { UsersClient } from "@/components/admin/users-client"

export default async function UsersAdminPage() {
  const session = await auth()
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    accessState: (u.hashedPassword ? "ACTIVE" : "PENDING") as
      | "ACTIVE"
      | "PENDING",
    createdAt: u.createdAt.toLocaleDateString("fr-FR"),
  }))

  return (
    <div className="space-y-6">
      <UsersClient
        data={serialized}
        currentUserId={session?.user?.id ?? ""}
      />
    </div>
  )
}
