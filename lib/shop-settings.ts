import { prisma } from "./prisma"

export type ProductDisplaySettings = {
  productsPerPage?: number
  gridColumnsDesktop?: number
  gridColumnsTablet?: number
  gridColumnsMobile?: number
  imageAspectRatio?: string
  hoverEffect?: string
  borderStyle?: string
  shadow?: string
}

/**
 * Get product display settings from the database
 */
export async function getProductDisplaySettings(): Promise<ProductDisplaySettings> {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        category: "shop",
      },
    })

    const result: ProductDisplaySettings = {}
    for (const setting of settings) {
      switch (setting.key) {
        case "products_per_page":
          result.productsPerPage = parseInt(setting.value) || 12
          break
        case "product_grid_columns_desktop":
          result.gridColumnsDesktop = parseInt(setting.value) || 3
          break
        case "product_grid_columns_tablet":
          result.gridColumnsTablet = parseInt(setting.value) || 2
          break
        case "product_grid_columns_mobile":
          result.gridColumnsMobile = parseInt(setting.value) || 1
          break
        case "product_image_aspect_ratio":
          result.imageAspectRatio = setting.value || "square"
          break
        case "product_card_hover_effect":
          result.hoverEffect = setting.value || "lift"
          break
        case "product_card_border_style":
          result.borderStyle = setting.value || "none"
          break
        case "product_card_shadow":
          result.shadow = setting.value || "medium"
          break
      }
    }

    // Apply defaults if not set
    return {
      productsPerPage: result.productsPerPage || 12,
      gridColumnsDesktop: result.gridColumnsDesktop || 3,
      gridColumnsTablet: result.gridColumnsTablet || 2,
      gridColumnsMobile: result.gridColumnsMobile || 1,
      imageAspectRatio: result.imageAspectRatio || "square",
      hoverEffect: result.hoverEffect || "lift",
      borderStyle: result.borderStyle || "none",
      shadow: result.shadow || "medium",
      ...result,
    }
  } catch (error) {
    console.error("Error fetching product display settings:", error)
    // Return defaults on error
    return {
      productsPerPage: 12,
      gridColumnsDesktop: 3,
      gridColumnsTablet: 2,
      gridColumnsMobile: 1,
      imageAspectRatio: "square",
      hoverEffect: "lift",
      borderStyle: "none",
      shadow: "medium",
    }
  }
}

/**
 * Get CSS classes for product grid based on settings
 */
export function getProductGridClasses(settings: ProductDisplaySettings): string {
  const mobileCols = settings.gridColumnsMobile || 1
  const tabletCols = settings.gridColumnsTablet || 2
  const desktopCols = settings.gridColumnsDesktop || 3

  return `grid grid-cols-${mobileCols} md:grid-cols-${tabletCols} lg:grid-cols-${desktopCols} gap-8`
}

/**
 * Get CSS classes for product card based on settings
 */
export function getProductCardClasses(settings: ProductDisplaySettings): string {
  const classes: string[] = ["group", "cursor-pointer"]

  // Hover effects
  switch (settings.hoverEffect) {
    case "lift":
      classes.push("transition-transform hover:-translate-y-1")
      break
    case "scale":
      classes.push("transition-transform hover:scale-105")
      break
    case "fade":
      classes.push("transition-opacity hover:opacity-80")
      break
    case "glow":
      classes.push("transition-shadow hover:shadow-lg hover:shadow-accent-orange/20")
      break
  }

  // Border styles
  switch (settings.borderStyle) {
    case "thin":
      classes.push("border border-gray-200")
      break
    case "medium":
      classes.push("border-2 border-gray-300")
      break
    case "thick":
      classes.push("border-4 border-gray-400")
      break
  }

  // Shadows
  switch (settings.shadow) {
    case "small":
      classes.push("shadow-sm")
      break
    case "medium":
      classes.push("shadow")
      break
    case "large":
      classes.push("shadow-lg")
      break
  }

  return classes.join(" ")
}

/**
 * Get aspect ratio class for product images
 */
export function getProductImageAspectRatio(settings: ProductDisplaySettings): string {
  switch (settings.imageAspectRatio) {
    case "square":
      return "aspect-square"
    case "portrait":
      return "aspect-[3/4]"
    case "landscape":
      return "aspect-[4/3]"
    case "tall":
      return "aspect-[2/3]"
    case "wide":
      return "aspect-[3/2]"
    default:
      return "aspect-square"
  }
}
