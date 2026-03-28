import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { canAccessAdminPath, canAccessApplicantPortal } from "@/lib/rbac"
import { isApplicantRole } from "@/lib/applicant-portal.shared"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.hashedPassword) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
      } else if (token.id) {
        // Refresh role from DB on every token rotation so admin role changes
        // take effect without waiting for the token to expire.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const role = auth?.user?.role as string | undefined
      const { pathname } = request.nextUrl
      
      const isOnAdmin = pathname.startsWith("/admin")
      const isOnApplicantPortal =
        pathname.startsWith("/espace-client") &&
        pathname !== "/espace-client/connexion"
      const isOnAdminLogin = pathname === "/login"
      const isOnApplicantLogin = pathname === "/espace-client/connexion"

      if (isOnAdmin) {
        if (!isLoggedIn) return false

        if (!canAccessAdminPath(pathname, role)) {
          return Response.redirect(new URL("/admin", request.nextUrl))
        }
        
        return true
      }

      if (isOnApplicantPortal) {
        if (!isLoggedIn) {
          return Response.redirect(
            new URL("/espace-client/connexion", request.nextUrl)
          )
        }

        if (!canAccessApplicantPortal(role)) {
          return Response.redirect(new URL("/admin", request.nextUrl))
        }

        return true
      }

      if ((isOnAdminLogin || isOnApplicantLogin) && isLoggedIn) {
        const target = isApplicantRole(role) ? "/espace-client" : "/admin"
        return Response.redirect(new URL(target, request.nextUrl))
      }

      return true
    },
  },
})
