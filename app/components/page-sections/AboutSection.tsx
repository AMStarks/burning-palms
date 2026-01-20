import { getContentWidthClass } from "@/lib/layout-settings"

type AboutSectionProps = {
  settings: any
  content: any
}

export async function AboutSection({ settings, content }: AboutSectionProps) {
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
