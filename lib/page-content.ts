import { prisma } from "@/lib/prisma"
import {
  buildAboutPageContent,
  buildHomePageContent,
  pageContentDefinitions,
} from "@/lib/page-content.shared"
import type {
  AboutPageContent,
  HomePageContent,
  PageContentRecord,
} from "@/lib/page-content.shared"

async function getPageContentRecords(pageKey: string): Promise<PageContentRecord[]> {
  try {
    return await prisma.pageContent.findMany({
      where: {
        pageKey,
        sectionKey: {
          in: pageContentDefinitions
            .filter((definition) => definition.pageKey === pageKey)
            .map((definition) => definition.sectionKey),
        },
      },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      select: {
        pageKey: true,
        sectionKey: true,
        title: true,
        subtitle: true,
        content: true,
        published: true,
        order: true,
      },
    })
  } catch {
    return []
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return buildHomePageContent(await getPageContentRecords("home"))
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  return buildAboutPageContent(await getPageContentRecords("about"))
}
