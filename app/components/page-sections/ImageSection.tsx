import Image from "next/image"

type ImageSectionProps = {
  settings: any
  content: any
}

export async function ImageSection({ settings, content }: ImageSectionProps) {
  const paddingClass = {
    none: "py-0",
    small: "py-4",
    normal: "py-16",
    large: "py-24",
    xlarge: "py-32",
  }[settings?.padding || "normal"]

  const spacingClass = {
    none: "mb-0",
    small: "mb-6",
    normal: "mb-12",
    large: "mb-20",
    xlarge: "mb-32",
  }[settings?.spacing || "normal"]

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-7xl",
  }[settings?.maxWidth || "full"]

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
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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
