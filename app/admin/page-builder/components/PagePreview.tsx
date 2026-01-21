"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type PageSection = {
  id: string
  type: string
  settings: string | null
  content: string | null
  visible: boolean
  order: number
}

type PagePreviewProps = {
  sections: PageSection[]
  selectedSectionId: string | null
  onSectionClick: (sectionId: string) => void
}

export function PagePreview({ sections, selectedSectionId, onSectionClick }: PagePreviewProps) {
  const [siteSettings, setSiteSettings] = useState({
    title: "Burning Palms",
    tagline: "Retro 70s Australian Surf & Street Wear",
    logoUrl: "/logo.png",
  })

  useEffect(() => {
    // Fetch site settings
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const title = data.find((s: any) => s.key === "site_title")?.value || "Burning Palms"
          const tagline = data.find((s: any) => s.key === "site_tagline")?.value || "Retro 70s Australian Surf & Street Wear"
          const logo = data.find((s: any) => s.key === "logo_url")?.value || "/logo.png"
          setSiteSettings({ title, tagline, logoUrl: logo })
        }
      })
      .catch(console.error)
  }, [])

  // Client-side version of HeroSection - matches server component exactly
  const HeroSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
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

  // Client-side version of ProductsSection - matches server component exactly
  const ProductsSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      small: "py-4",
      normal: "py-16",
      large: "py-24",
      xlarge: "py-32",
    }
    const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

    const spacingMap: Record<string, string> = {
      none: "mb-0",
      small: "mb-6",
      normal: "mb-12",
      large: "mb-20",
      xlarge: "mb-32",
    }
    const spacingClass = spacingMap[settings?.spacing || "normal"] || spacingMap.normal

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-7xl",
    }
    const maxWidthClass = maxWidthMap[settings?.maxWidth || "full"] || maxWidthMap.full

    const backgroundColor = settings?.backgroundColor || "transparent"
    const textColor = settings?.textColor || "inherit"

    const productCount = content?.productCount || 6
    const columnsDesktop = parseInt(content?.columnsDesktop || "3")

    const products = Array.from({ length: productCount }, (_, i) => ({
      id: i + 1,
      name: `Collection ${i + 1}`,
    }))

    const gridClasses = `grid grid-cols-1 md:grid-cols-${columnsDesktop} gap-6`

    return (
      <section
        className={`${paddingClass} px-4 sm:px-6 lg:px-8 ${spacingClass}`}
        style={{
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          color: textColor !== "inherit" ? textColor : undefined,
        }}
      >
        <div className={`${maxWidthClass} mx-auto`}>
          <h2 className="font-display text-4xl md:text-5xl text-center text-accent-dark mb-12">
            SHOP THE COLLECTION
          </h2>
          <div className={gridClasses}>
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="aspect-square bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-foreground/40">Product Image</span>
                </div>
                <h3 className="font-display text-2xl text-accent-dark mb-2">{product.name}</h3>
                <p className="text-foreground/70">Shop now →</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Client-side version of AboutSection - matches server component exactly
  const AboutSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      small: "py-4",
      normal: "py-16",
      large: "py-24",
      xlarge: "py-32",
    }
    const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

    const spacingMap: Record<string, string> = {
      none: "mb-0",
      small: "mb-6",
      normal: "mb-12",
      large: "mb-20",
      xlarge: "mb-32",
    }
    const spacingClass = spacingMap[settings?.spacing || "normal"] || spacingMap.normal

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-7xl",
    }
    const maxWidthClass = maxWidthMap[settings?.maxWidth || "full"] || maxWidthMap.full

    const textAlignMap: Record<string, string> = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }
    const textAlignClass = textAlignMap[settings?.textAlign || "center"] || textAlignMap.center

    const backgroundColor = settings?.backgroundColor || "transparent"
    const textColor = settings?.textColor || "inherit"

    const heading = content?.heading || "AUSTRALIAN SURF CULTURE"
    const text = content?.text || "Born from the beaches of Australia, Burning Palms brings you authentic surf and street wear with a retro 70s vibe. Each piece is designed to capture the essence of coastal living and laid-back style."

    return (
      <section
        className={`${paddingClass} px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-yellow/5 to-accent-orange/5 ${spacingClass}`}
        style={{
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          color: textColor !== "inherit" ? textColor : undefined,
        }}
      >
        <div className={`${maxWidthClass} mx-auto ${textAlignClass}`}>
          <h2 className="font-display text-4xl md:text-5xl text-accent-dark mb-6">
            {heading}
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            {text}
          </p>
        </div>
      </section>
    )
  }

  // Client-side version of TextSection - no heading
  const TextSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      small: "py-4",
      normal: "py-16",
      large: "py-24",
      xlarge: "py-32",
    }
    const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

    const spacingMap: Record<string, string> = {
      none: "mb-0",
      small: "mb-6",
      normal: "mb-12",
      large: "mb-20",
      xlarge: "mb-32",
    }
    const spacingClass = spacingMap[settings?.spacing || "normal"] || spacingMap.normal

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-7xl",
    }
    const maxWidthClass = maxWidthMap[settings?.maxWidth || "full"] || maxWidthMap.full

    const textAlignMap: Record<string, string> = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }
    const textAlignClass = textAlignMap[settings?.textAlign || "left"] || textAlignMap.left

    const backgroundColor = settings?.backgroundColor || "transparent"
    const textColor = settings?.textColor || "inherit"
    const text = content?.text || ""

    return (
      <section
        className={`${paddingClass} px-4 sm:px-6 lg:px-8 ${spacingClass}`}
        style={{
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          color: textColor !== "inherit" ? textColor : undefined,
        }}
      >
        <div className={`${maxWidthClass} mx-auto ${textAlignClass}`}>
          <div className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
            {text}
          </div>
        </div>
      </section>
    )
  }

  const ContactFormSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      small: "py-4",
      normal: "py-16",
      large: "py-24",
      xlarge: "py-32",
    }
    const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

    const spacingMap: Record<string, string> = {
      none: "mb-0",
      small: "mb-6",
      normal: "mb-12",
      large: "mb-20",
      xlarge: "mb-32",
    }
    const spacingClass = spacingMap[settings?.spacing || "normal"] || spacingMap.normal

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-7xl",
    }
    const maxWidthClass = maxWidthMap[settings?.maxWidth || "lg"] || maxWidthMap.lg

    const backgroundColor = settings?.backgroundColor || "transparent"
    const textColor = settings?.textColor || "inherit"

    const heading = content?.heading || "CONTACT"
    const intro = content?.intro || ""

    return (
      <section
        className={`${paddingClass} px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-yellow/5 to-accent-orange/5 ${spacingClass}`}
        style={{
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          color: textColor !== "inherit" ? textColor : undefined,
        }}
      >
        <div className={`${maxWidthClass} mx-auto`}>
          <h2 className="font-display text-4xl md:text-5xl text-accent-dark mb-4 text-center">
            {heading}
          </h2>
          {intro ? (
            <p className="text-foreground/80 text-lg leading-relaxed mb-8 text-center">{intro}</p>
          ) : null}
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="h-10 rounded border border-gray-300 bg-gray-50" />
              <div className="h-10 rounded border border-gray-300 bg-gray-50" />
            </div>
            <div className="h-10 rounded border border-gray-300 bg-gray-50" />
            <div className="h-28 rounded border border-gray-300 bg-gray-50" />
            <div className="h-14 rounded border border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-500">
              Captcha (Turnstile)
            </div>
            <div className="h-12 rounded-full bg-accent-orange/90" />
          </div>
        </div>
      </section>
    )
  }

  // Client-side version of ImageSection - matches server component exactly
  const ImageSectionPreview = ({ settings, content }: { settings: any; content: any }) => {
    const paddingMap: Record<string, string> = {
      none: "py-0",
      small: "py-4",
      normal: "py-16",
      large: "py-24",
      xlarge: "py-32",
    }
    const paddingClass = paddingMap[settings?.padding || "normal"] || paddingMap.normal

    const spacingMap: Record<string, string> = {
      none: "mb-0",
      small: "mb-6",
      normal: "mb-12",
      large: "mb-20",
      xlarge: "mb-32",
    }
    const spacingClass = spacingMap[settings?.spacing || "normal"] || spacingMap.normal

    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-7xl",
    }
    const maxWidthClass = maxWidthMap[settings?.maxWidth || "full"] || maxWidthMap.full

    const backgroundColor = settings?.backgroundColor || "transparent"
    const textColor = settings?.textColor || "inherit"

    const imageUrl = content?.imageUrl || ""
    const altText = content?.altText || "Image"
    const caption = content?.caption || ""

    return (
      <section
        className={`${paddingClass} px-4 sm:px-6 lg:px-8 ${spacingClass}`}
        style={{
          backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
          color: textColor !== "inherit" ? textColor : undefined,
        }}
      >
        <div className={`${maxWidthClass} mx-auto`}>
          {imageUrl ? (
            <div className="relative w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={altText}
                  className="w-full h-full object-cover"
                />
              </div>
              {caption && (
                <p className="mt-4 text-center text-sm text-foreground/70">{caption}</p>
              )}
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 flex items-center justify-center">
              <span className="text-foreground/40">No image selected</span>
            </div>
          )}
        </div>
      </section>
    )
  }

  const renderSection = (section: PageSection) => {
    if (!section.visible) return null

    const settings = section.settings ? JSON.parse(section.settings) : {}
    const content = section.content ? JSON.parse(section.content) : {}

    const isSelected = selectedSectionId === section.id
    const borderClass = isSelected ? "ring-4 ring-accent-orange ring-inset" : ""

    const wrapperProps = {
      key: section.id,
      className: `relative ${borderClass} cursor-pointer group transition-all duration-200`,
      onClick: () => onSectionClick(section.id),
      onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
          e.currentTarget.style.outline = "3px solid #ff00ff"
          e.currentTarget.style.outlineOffset = "-3px"
        }
      },
      onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
          e.currentTarget.style.outline = ""
          e.currentTarget.style.outlineOffset = ""
        }
      },
    }

    switch (section.type) {
      case "hero":
        return (
          <div {...wrapperProps}>
            <HeroSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      case "products":
        return (
          <div {...wrapperProps}>
            <ProductsSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      case "about":
        return (
          <div {...wrapperProps}>
            <AboutSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      case "text":
        return (
          <div {...wrapperProps}>
            <TextSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      case "image":
        return (
          <div {...wrapperProps}>
            <ImageSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      case "contact":
        return (
          <div {...wrapperProps}>
            <ContactFormSectionPreview settings={settings} content={content} />
            {isSelected && (
              <div className="absolute top-2 left-2 bg-accent-orange text-white px-2 py-1 rounded text-xs font-bold z-50 pointer-events-none">
                SELECTED
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order)

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Header Preview - Match homepage header exactly */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-[75px] w-auto">
                <Image
                  src={siteSettings.logoUrl}
                  alt="Burning Palms Logo"
                  width={133}
                  height={75}
                  className="object-contain h-full w-auto"
                  style={{ height: "auto" }}
                />
              </div>
              <div className="font-display text-2xl text-accent-dark">
                {siteSettings.title.toUpperCase()}
              </div>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="#" className="text-gray-700 hover:text-accent-orange">Shop</Link>
              <Link href="#" className="text-gray-700 hover:text-accent-orange">Collections</Link>
              <Link href="#" className="text-gray-700 hover:text-accent-orange">About</Link>
              <Link href="#" className="text-gray-700 hover:text-accent-orange">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Sections Preview - Use EXACT same rendering logic as homepage */}
      <main className="relative">
        {visibleSections.length > 0 ? (
          visibleSections.map((section) => renderSection(section))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No sections configured</p>
            <p className="text-sm">Add sections using the buttons on the left</p>
          </div>
        )}
      </main>

      {/* Footer Preview - Match homepage footer exactly */}
      <footer className="border-t border-accent-brown/20 mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-brown/60">
            © 2025 Burning Palms. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
