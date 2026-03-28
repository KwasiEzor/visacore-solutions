export { auth as proxy } from "@/lib/auth"

export const config = {
  matcher: ["/admin/:path*", "/espace-client/:path*", "/login"],
}
