import { getSiteSettings } from "@/lib/settings"

type HeroSectionProps = {
  settings: any
  content: any
}

export async function HeroSection({ settings, content }: HeroSectionProps) {
  const siteSettings = await getSiteSettings()
  
  const paddingMap: Record<string, string> = {
    none: "py-0",
    small: "py-4",
    normal: "py-8",
    large: "py-16",
    xlarge: "py-24",
  }
  const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

  const heightMap: Record<string, string> = {
    "50vh": "min-h-[50vh]",
    "60vh": "min-h-[60vh]",
    "80vh": "min-h-[80vh]",
    "100vh": "min-h-screen",
  }
  const heightClass = heightMap[settings?.height || "80vh"] || heightMap["80vh"]

  const backgroundColor = settings?.backgroundColor || "transparent"
  const textColor = settings?.textColor || "inherit"

  const title = content?.title || siteSettings.title.toUpperCase()
  const subtitle = content?.subtitle || siteSettings.tagline
  const backgroundImageUrl = content?.backgroundImageUrl || ""

  return (
    <section
      className={`relative ${heightClass} flex items-center justify-center overflow-hidden ${paddingClass}`}
      style={{
        backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
        color: textColor !== "inherit" ? textColor : undefined,
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: backgroundImageUrl ? "cover" : undefined,
        backgroundPosition: backgroundImageUrl ? "center" : undefined,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/10 via-background to-accent-orange/10"></div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <div className="inline-block p-8 bg-background/90 rounded-lg shadow-lg">
            <div className="text-6xl md:text-8xl font-display text-accent-dark mb-4">
              {title}
            </div>
            <div className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              {subtitle}
            </div>
          </div>
        </div>
        <div className="space-x-4">
          <button className="px-8 py-3 bg-accent-orange text-white font-display text-xl rounded-full hover:bg-accent-orange/90 transition-colors shadow-lg">
            SHOP NOW
          </button>
          <button className="px-8 py-3 border-2 border-accent-dark text-accent-dark font-display text-xl rounded-full hover:bg-accent-dark hover:text-background transition-colors">
            EXPLORE
          </button>
        </div>
      </div>
    </section>
  )
}
