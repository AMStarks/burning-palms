type TextSectionProps = {
  settings: any
  content: any
}

export async function TextSection({ settings, content }: TextSectionProps) {
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

