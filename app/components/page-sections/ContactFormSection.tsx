import { ContactForm } from "@/app/components/ContactForm"

type ContactFormSectionProps = {
  settings: any
  content: any
}

export async function ContactFormSection({ settings, content }: ContactFormSectionProps) {
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
  const successMessage = content?.successMessage || ""
  const inquiryOptions: string[] = Array.isArray(content?.inquiryOptions)
    ? content.inquiryOptions
    : typeof content?.inquiryOptions === "string"
      ? content.inquiryOptions.split(",")
      : ["Order", "Other"]

  return (
    <section
      className={`${paddingClass} px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-yellow/5 to-accent-orange/5 ${spacingClass}`}
      style={{
        backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined,
        color: textColor !== "inherit" ? textColor : undefined,
      }}
    >
      <div className={`${maxWidthClass} mx-auto`}>
        {heading ? (
          <h2 className="font-display text-4xl md:text-5xl text-accent-dark mb-4 text-center">
            {heading}
          </h2>
        ) : null}
        {intro ? (
          <p className="text-foreground/80 text-lg leading-relaxed mb-8 text-center">
            {intro}
          </p>
        ) : null}

        <ContactForm inquiryOptions={inquiryOptions} successMessage={successMessage || undefined} />
      </div>
    </section>
  )
}

