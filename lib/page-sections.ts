import { prisma } from "./prisma"

export type PageSection = {
  id: string
  pageId: string | null
  type: string
  order: number
  settings: string | null
  content: string | null
  visible: boolean
}

/**
 * Get all page sections for a page (null pageId = homepage)
 */
export async function getPageSections(pageId: string | null = null): Promise<PageSection[]> {
  try {
    const sections = await prisma.pageSection.findMany({
      where: { pageId: pageId || null },
      orderBy: { order: "asc" },
    })
    return sections
  } catch (error) {
    console.error("Error fetching page sections:", error)
    return []
  }
}
