import { HeroSection } from "./HeroSection"
import { ProductsSection } from "./ProductsSection"
import { AboutSection } from "./AboutSection"
import { ImageSection } from "./ImageSection"
import { TextSection } from "./TextSection"
import { ContactFormSection } from "./ContactFormSection"

type PageSection = {
  id: string
  type: string
  settings: string | null
  content: string | null
  visible: boolean
}

type SectionRendererProps = {
  section: PageSection
}

export async function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.visible) return null

  const settings = section.settings ? JSON.parse(section.settings) : {}
  const content = section.content ? JSON.parse(section.content) : {}

  switch (section.type) {
    case "hero":
      return <HeroSection settings={settings} content={content} />
    case "products":
      return <ProductsSection settings={settings} content={content} />
    case "about":
      return <AboutSection settings={settings} content={content} />
    case "text":
      return <TextSection settings={settings} content={content} />
    case "image":
      return <ImageSection settings={settings} content={content} />
    case "contact":
      return <ContactFormSection settings={settings} content={content} />
    default:
      return null
  }
}
