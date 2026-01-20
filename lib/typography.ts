import { prisma } from "./prisma"

export type TypographySettings = {
  bodyFont?: string
  displayFont?: string
  baseSize?: string
  baseWeight?: string
  headingWeight?: string
  lineHeight?: string
  letterSpacing?: string
}

/**
 * Get global typography settings from the database
 */
export async function getGlobalTypographySettings(): Promise<TypographySettings> {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        category: "typography",
      },
    })

    const result: TypographySettings = {}
    for (const setting of settings) {
      switch (setting.key) {
        case "typography_body_font":
          result.bodyFont = setting.value
          break
        case "typography_display_font":
          result.displayFont = setting.value
          break
        case "typography_base_size":
          result.baseSize = setting.value
          break
        case "typography_base_weight":
          result.baseWeight = setting.value
          break
        case "typography_heading_weight":
          result.headingWeight = setting.value
          break
        case "typography_line_height":
          result.lineHeight = setting.value
          break
        case "typography_letter_spacing":
          result.letterSpacing = setting.value
          break
      }
    }

    // Apply defaults if not set
    return {
      bodyFont: result.bodyFont || "Inter",
      displayFont: result.displayFont || "Bebas Neue",
      baseSize: result.baseSize || "16",
      baseWeight: result.baseWeight || "400",
      headingWeight: result.headingWeight || "700",
      lineHeight: result.lineHeight || "1.5",
      letterSpacing: result.letterSpacing || "0",
      ...result,
    }
  } catch (error) {
    console.error("Error fetching typography settings:", error)
    // Return defaults on error
    return {
      bodyFont: "Inter",
      displayFont: "Bebas Neue",
      baseSize: "16",
      baseWeight: "400",
      headingWeight: "700",
      lineHeight: "1.5",
      letterSpacing: "0",
    }
  }
}

/**
 * Get page-specific typography settings and merge with global settings
 * Page settings override global settings
 */
export async function getPageTypographySettings(
  pageId?: string
): Promise<TypographySettings> {
  const global = await getGlobalTypographySettings()

  if (!pageId) {
    return global
  }

  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { settings: true },
    })

    if (!page?.settings) {
      return global
    }

    const pageSettings = JSON.parse(page.settings || "{}")
    const pageTypography = pageSettings.typography as TypographySettings | undefined

    if (!pageTypography) {
      return global
    }

    // Merge: page settings override global settings
    return {
      ...global,
      ...pageTypography,
    }
  } catch (error) {
    console.error("Error parsing page typography settings:", error)
    return global
  }
}

/**
 * Convert font name to CSS font-family string
 */
export function fontNameToCSS(fontName: string): string {
  // Map common Google Fonts to their CSS font-family strings
  const fontMap: Record<string, string> = {
    "Inter": '"Inter", sans-serif',
    "Roboto": '"Roboto", sans-serif',
    "Open Sans": '"Open Sans", sans-serif',
    "Lato": '"Lato", sans-serif',
    "Montserrat": '"Montserrat", sans-serif',
    "Poppins": '"Poppins", sans-serif',
    "Source Sans Pro": '"Source Sans Pro", sans-serif',
    "Raleway": '"Raleway", sans-serif',
    "Nunito": '"Nunito", sans-serif',
    "Bebas Neue": '"Bebas Neue", cursive',
    "Oswald": '"Oswald", sans-serif',
    "Playfair Display": '"Playfair Display", serif',
    "Lobster": '"Lobster", cursive',
    "Barlow Condensed": '"Barlow Condensed", sans-serif',
    "Anton": '"Anton", sans-serif',
    "Righteous": '"Righteous", cursive',
  }

  return fontMap[fontName] || `"${fontName}", sans-serif`
}

/**
 * Generate CSS custom properties for typography
 */
export function generateTypographyCSS(settings: TypographySettings): string {
  const bodyFont = fontNameToCSS(settings.bodyFont || "Inter")
  const displayFont = fontNameToCSS(settings.displayFont || "Bebas Neue")
  const baseSize = settings.baseSize || "16"
  const baseWeight = settings.baseWeight || "400"
  const headingWeight = settings.headingWeight || "700"
  const lineHeight = settings.lineHeight || "1.5"
  const letterSpacing = settings.letterSpacing || "0"

  return `
    --typography-body-font: ${bodyFont};
    --typography-display-font: ${displayFont};
    --typography-base-size: ${baseSize}px;
    --typography-base-weight: ${baseWeight};
    --typography-heading-weight: ${headingWeight};
    --typography-line-height: ${lineHeight};
    --typography-letter-spacing: ${letterSpacing}px;
  `.trim()
}
