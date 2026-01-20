import { prisma } from "./prisma"

export type MenuItem = {
  id: string
  label: string
  url: string
  order: number
  children?: MenuItem[]
}

export type Menu = {
  id: string
  name: string
  location: string | null
  items: MenuItem[]
}

/**
 * Get menu by location (e.g., "header", "footer")
 */
export async function getMenuByLocation(location: string): Promise<Menu | null> {
  try {
    const menu = await prisma.menu.findFirst({
      where: { location },
      include: {
        items: {
          where: { parentId: null }, // Only top-level items
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    return menu as Menu | null
  } catch (error) {
    console.error(`Error fetching menu for location ${location}:`, error)
    return null
  }
}

/**
 * Get menu by ID
 */
export async function getMenuById(id: string): Promise<Menu | null> {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    return menu as Menu | null
  } catch (error) {
    console.error(`Error fetching menu ${id}:`, error)
    return null
  }
}
