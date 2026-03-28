import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isApplicantRole } from "@/lib/applicant-portal.shared"
import { PortalHeader } from "@/components/applicant/portal-header"

export default async function ApplicantPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/espace-client/connexion")
  }

  if (!isApplicantRole(session.user.role)) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]">
      <PortalHeader
        name={session.user.name ?? null}
        email={session.user.email ?? null}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  )
}
