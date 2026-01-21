import { prisma } from "./prisma"

/**
 * Get a single setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    })
    return setting?.value || null
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error)
    return null
  }
}

/**
 * Get multiple settings by keys
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: keys },
      },
    })
    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }
    return result
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {}
  }
}

/**
 * Get common site settings (title, description, tagline, logo)
 */
export async function getSiteSettings() {
  const settings = await getSettings([
    "site_title",
    "site_description",
    "site_tagline",
    "logo_url",
    "favicon_url",
  ])
  return {
    title: settings.site_title || "Burning Palms",
    description: settings.site_description || "Retro 70s inspired Australian surf and street wear. Authentic style from down under.",
    tagline: settings.site_tagline || "Retro 70s Australian Surf & Street Wear",
    logoUrl: settings.logo_url || "/logo.png",
    faviconUrl: settings.favicon_url || "/icon",
  }
}
