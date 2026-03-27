import { config } from "dotenv"

config({ path: ".env.local" })
config()

let prismaClient:
  | typeof import("@/lib/prisma").prisma
  | undefined

async function main() {
  const [{ prisma }, { collectContentIntegrityIssues }] = await Promise.all([
    import("@/lib/prisma"),
    import("@/lib/content-integrity"),
  ])
  prismaClient = prisma

  const [services, destinations, settings] = await Promise.all([
    prisma.service.findMany({
      where: { published: true },
      select: { slug: true, benefits: true },
    }),
    prisma.destination.findMany({
      where: { published: true },
      select: {
        slug: true,
        opportunities: true,
        visaCategories: true,
        whyChoose: true,
      },
    }),
    prisma.siteSetting.findMany({
      select: { key: true },
    }),
  ])

  const issues = collectContentIntegrityIssues({
    services,
    destinations,
    settings,
  })

  if (issues.length > 0) {
    console.error("Content integrity check failed:")
    for (const issue of issues) {
      console.error(`- [${issue.scope}] ${issue.identifier}: ${issue.message}`)
    }
    process.exit(1)
  }

  console.log(
    `Content integrity check passed for ${services.length} published services, ${destinations.length} published destinations, and ${settings.length} settings.`
  )
}

main()
  .catch((error) => {
    console.error("Content integrity check failed with an unexpected error.")
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient?.$disconnect()
  })
