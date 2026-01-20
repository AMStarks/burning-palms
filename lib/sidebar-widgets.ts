import { prisma } from "./prisma"

export type SidebarWidget = {
  id: string
  title: string | null
  type: string
  content: string | null
  order: number
}

/**
 * Get all sidebar widgets, ordered by order
 */
export async function getSidebarWidgets(): Promise<SidebarWidget[]> {
  try {
    const widgets = await prisma.sidebarWidget.findMany({
      orderBy: { order: "asc" },
    })

    return widgets as SidebarWidget[]
  } catch (error) {
    console.error("Error fetching sidebar widgets:", error)
    return []
  }
}
