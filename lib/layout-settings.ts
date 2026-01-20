import { prisma } from "./prisma"

export type LayoutSettings = {
  containerWidth?: string
  contentWidth?: string
  sidebarPosition?: string
  sidebarWidth?: string
}

/**
 * Get layout settings from the database
 */
export async function getLayoutSettings(): Promise<LayoutSettings> {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        category: "layout",
      },
    })

    const result: LayoutSettings = {}
    for (const setting of settings) {
      switch (setting.key) {
        case "container_width":
          result.containerWidth = setting.value || "7xl"
          break
        case "content_width":
          result.contentWidth = setting.value || "7xl"
          break
        case "sidebar_position":
          result.sidebarPosition = setting.value || "none"
          break
        case "sidebar_width":
          result.sidebarWidth = setting.value || "normal"
          break
      }
    }

    // Apply defaults if not set
    return {
      containerWidth: result.containerWidth || "7xl",
      contentWidth: result.contentWidth || "7xl",
      sidebarPosition: result.sidebarPosition || "none",
      sidebarWidth: result.sidebarWidth || "normal",
      ...result,
    }
  } catch (error) {
    console.error("Error fetching layout settings:", error)
    // Return defaults on error
    return {
      containerWidth: "7xl",
      contentWidth: "7xl",
      sidebarPosition: "none",
      sidebarWidth: "normal",
    }
  }
}

/**
 * Get CSS class for container width
 */
export function getContainerWidthClass(width: string): string {
  if (width === "full") {
    return "w-full"
  }
  return `max-w-${width}`
}

/**
 * Get CSS class for content width
 */
export function getContentWidthClass(width: string): string {
  return `max-w-${width}`
}

/**
 * Get CSS classes for sidebar layout
 */
export function getSidebarLayoutClasses(settings: LayoutSettings): {
  container: string
  content: string
  sidebar: string
} {
  const hasSidebar = settings.sidebarPosition && settings.sidebarPosition !== "none"
  
  if (!hasSidebar) {
    return {
      container: "w-full",
      content: "w-full",
      sidebar: "",
    }
  }

  const sidebarWidthClass = 
    settings.sidebarWidth === "narrow" ? "w-64" :
    settings.sidebarWidth === "wide" ? "w-96" :
    "w-80"

  const containerClass = settings.sidebarPosition === "left" 
    ? "flex flex-row"
    : "flex flex-row-reverse"

  return {
    container: containerClass,
    content: "flex-1",
    sidebar: sidebarWidthClass,
  }
}
