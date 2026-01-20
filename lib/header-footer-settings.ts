import { prisma } from "./prisma"

export type HeaderFooterSettings = {
  headerSticky?: boolean
  headerLayout?: string
  headerHeight?: string
  footerColumns?: number
  footerCopyrightText?: string
}

/**
 * Get header/footer settings from the database
 */
export async function getHeaderFooterSettings(): Promise<HeaderFooterSettings> {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        category: "header_footer",
      },
    })

    const result: HeaderFooterSettings = {}
    for (const setting of settings) {
      switch (setting.key) {
        case "header_sticky":
          result.headerSticky = setting.value === "true"
          break
        case "header_layout":
          result.headerLayout = setting.value || "standard"
          break
        case "header_height":
          result.headerHeight = setting.value || "normal"
          break
        case "footer_columns":
          result.footerColumns = parseInt(setting.value) || 4
          break
        case "footer_copyright_text":
          result.footerCopyrightText = setting.value || "© 2025 Burning Palms. All rights reserved."
          break
      }
    }

    // Apply defaults if not set
    return {
      headerSticky: result.headerSticky !== undefined ? result.headerSticky : true,
      headerLayout: result.headerLayout || "standard",
      headerHeight: result.headerHeight || "normal",
      footerColumns: result.footerColumns || 4,
      footerCopyrightText: result.footerCopyrightText || "© 2025 Burning Palms. All rights reserved.",
      ...result,
    }
  } catch (error) {
    console.error("Error fetching header/footer settings:", error)
    // Return defaults on error
    return {
      headerSticky: true,
      headerLayout: "standard",
      headerHeight: "normal",
      footerColumns: 4,
      footerCopyrightText: "© 2025 Burning Palms. All rights reserved.",
    }
  }
}

/**
 * Get CSS classes for header based on settings
 */
export function getHeaderClasses(settings: HeaderFooterSettings): {
  nav: string
  container: string
  height: string
  layout: string
} {
  const stickyClass = settings.headerSticky ? "sticky top-0 z-50" : ""
  const heightClass = 
    settings.headerHeight === "compact" ? "h-16" :
    settings.headerHeight === "tall" ? "h-24" :
    "h-20"

  // Determine container class based on layout
  let containerClass = "flex justify-between items-center"
  if (settings.headerLayout === "centered") {
    containerClass = "flex flex-col items-center justify-center"
  } else if (settings.headerLayout === "split") {
    containerClass = "flex justify-between items-center"
  }

  return {
    nav: `${stickyClass} border-b border-accent-brown/20 bg-background/95 backdrop-blur-sm`,
    container: containerClass,
    height: heightClass,
    layout: settings.headerLayout || "standard",
  }
}

/**
 * Get CSS class for footer grid columns
 * Using custom CSS classes defined in globals.css to avoid Tailwind JIT issues
 */
export function getFooterGridStyle(columns: number): string {
  const columnClasses: Record<number, string> = {
    2: "grid gap-8 footer-grid-2",
    3: "grid gap-8 footer-grid-3",
    4: "grid gap-8 footer-grid-4",
    5: "grid gap-8 footer-grid-5",
  }
  return columnClasses[columns] || columnClasses[4]
}
