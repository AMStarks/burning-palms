import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { getLayoutSettings, getContainerWidthClass, getContentWidthClass } from "@/lib/layout-settings"
import { getHeaderFooterSettings, getHeaderClasses, getFooterGridStyle } from "@/lib/header-footer-settings"
import { getMenuByLocation } from "@/lib/menus"
import { Menu } from "@/app/components/Menu"
import { getFooterWidgets } from "@/lib/footer-widgets"
import { FooterWidget } from "@/app/components/FooterWidget"
import { getPageSections } from "@/lib/page-sections"
import { SectionRenderer } from "@/app/components/page-sections"

export const dynamic = "force-dynamic"

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Home is served at "/"
  if (!slug || slug === "home") {
    notFound()
  }

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { id: true, title: true, content: true, excerpt: true, status: true },
  })

  if (!page) {
    notFound()
  }

  // Draft pages are not "online". They should 404 publicly until published.
  if (page.status !== "published") {
    notFound()
  }

  const siteSettings = await getSiteSettings()
  const layoutSettings = await getLayoutSettings()
  const headerFooterSettings = await getHeaderFooterSettings()
  const headerMenu = await getMenuByLocation("header")
  const footerWidgets = await getFooterWidgets()
  const pageSections = await getPageSections(page.id)

  const containerClass = getContainerWidthClass(layoutSettings.containerWidth || "7xl")
  const contentClass = getContentWidthClass(layoutSettings.contentWidth || "7xl")
  const headerClasses = getHeaderClasses(headerFooterSettings)
  const footerGridStyle = getFooterGridStyle(headerFooterSettings.footerColumns || 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation (match homepage) */}
      <nav className={headerClasses.nav}>
        <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`${headerClasses.container} ${headerClasses.height}`}>
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-[75px] w-auto">
                <Image
                  src={siteSettings.logoUrl}
                  alt="Burning Palms Logo"
                  width={133}
                  height={75}
                  className="object-contain h-full w-auto"
                />
              </div>
              {siteSettings.title?.trim() ? (
                <div className="font-display text-2xl text-accent-dark">
                  {siteSettings.title.toUpperCase()}
                </div>
              ) : null}
            </Link>

            {headerMenu && headerMenu.items.length > 0 ? (
              <div className="hidden md:flex space-x-8">
                <Menu items={headerMenu.items} itemClassName="text-foreground hover:text-accent-orange transition-colors" />
              </div>
            ) : (
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-foreground hover:text-accent-orange transition-colors">Shop</a>
                <a href="#" className="text-foreground hover:text-accent-orange transition-colors">Collections</a>
                <a href="#" className="text-foreground hover:text-accent-orange transition-colors">About</a>
                <a href="#" className="text-foreground hover:text-accent-orange transition-colors">Contact</a>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button className="text-foreground hover:text-accent-orange">Search</button>
              <button className="text-foreground hover:text-accent-orange">Cart (0)</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="relative">
        {pageSections.length > 0 ? (
          pageSections.map((section) => <SectionRenderer key={section.id} section={section} />)
        ) : (
          <div className={`${contentClass} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
            <h1 className="font-display text-4xl md:text-5xl text-accent-dark mb-6">
              {page.title}
            </h1>
            {page.content ? (
              <div
                className="prose prose-lg max-w-none text-foreground/80"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-foreground/70">No content yet.</p>
            )}
          </div>
        )}
      </main>

      {/* Footer (match homepage) */}
      <footer className="border-t border-accent-brown/20 mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className={`${containerClass} mx-auto`}>
          <div className={`${footerGridStyle} mb-8`}>
            {Object.keys(footerWidgets).length > 0 ? (
              Array.from({ length: headerFooterSettings.footerColumns || 4 }, (_, i) => {
                const columnWidgets = footerWidgets[i] || []
                const widget = columnWidgets[0]
                return widget ? <FooterWidget key={i} widget={widget} /> : <div key={i}></div>
              })
            ) : (
              <>
                <div>
                  <h3 className="font-display text-xl text-accent-dark mb-4">{siteSettings.title.toUpperCase()}</h3>
                  <p className="text-foreground/70 text-sm">{siteSettings.description}</p>
                </div>
                <div />
                <div />
                <div />
              </>
            )}
          </div>

          <div className="pt-8 border-t border-accent-brown/10 text-center">
            <p className="text-accent-brown/60">
              {headerFooterSettings.footerCopyrightText || "© 2025 Burning Palms. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const siteSettings = await getSiteSettings()
  const baseUrl = process.env.NEXTAUTH_URL || "https://burningpalms.au"

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, content: true, status: true },
  })

  if (!page) {
    return {}
  }

  const description =
    page.excerpt ||
    (page.content ? page.content.replace(/<[^>]*>/g, "").trim().slice(0, 160) : "") ||
    siteSettings.description

  return {
    metadataBase: new URL(baseUrl),
    title: page.title,
    description,
    robots: page.status === "published" ? undefined : { index: false, follow: false },
    openGraph: {
      title: page.title,
      description,
      url: `${baseUrl}/${slug}`,
      type: "article",
    },
  }
}

