import Image from "next/image"
import Link from "next/link"
import { getAllProducts } from "@/lib/shopify"
import { getSiteSettings } from "@/lib/settings"
import { getMenuByLocation } from "@/lib/menus"
import { Menu } from "@/app/components/Menu"
import { getLayoutSettings, getContainerWidthClass } from "@/lib/layout-settings"
import { getHeaderFooterSettings, getHeaderClasses, getFooterGridStyle } from "@/lib/header-footer-settings"
import { getFooterWidgets } from "@/lib/footer-widgets"
import { FooterWidget } from "@/app/components/FooterWidget"
import {
  getProductDisplaySettings,
  getProductGridClasses,
  getProductCardClasses,
  getProductImageAspectRatio,
} from "@/lib/shop-settings"

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function ShopPage() {
  const siteSettings = await getSiteSettings()
  const layoutSettings = await getLayoutSettings()
  const headerFooterSettings = await getHeaderFooterSettings()
  const headerMenu = await getMenuByLocation("header")
  const footerWidgets = await getFooterWidgets()

  const productSettings = await getProductDisplaySettings()
  const gridClasses = getProductGridClasses(productSettings)
  const cardClasses = getProductCardClasses(productSettings)
  const imageAspectRatio = getProductImageAspectRatio(productSettings)

  const containerClass = getContainerWidthClass(layoutSettings.containerWidth || "7xl")
  const headerClasses = getHeaderClasses(headerFooterSettings)
  const footerGridStyle = getFooterGridStyle(headerFooterSettings.footerColumns || 4)

  // Fetch ALL products (Shopify paginated). Later we can paginate/filter on this page.
  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <Link href="/shop" className="text-foreground hover:text-accent-orange transition-colors">Shop</Link>
                <Link href="/shop" className="text-foreground hover:text-accent-orange transition-colors">Collections</Link>
                <Link href="/about" className="text-foreground hover:text-accent-orange transition-colors">About</Link>
                <Link href="/contact" className="text-foreground hover:text-accent-orange transition-colors">Contact</Link>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button className="text-foreground hover:text-accent-orange">Search</button>
              <button className="text-foreground hover:text-accent-orange">Cart (0)</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page */}
      <main className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-5xl text-accent-dark mb-3">SHOP</h1>
          <p className="text-foreground/70">
            Browse the full collection. Checkout is handled securely by Shopify.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-foreground/70 py-16">
            No products found yet.
          </div>
        ) : (
          <div className={gridClasses}>
            {products.map((p) => {
              const img = p.images?.[0]
              return (
                <Link key={p.id} href={`/products/${p.handle}`} className={cardClasses}>
                  <div className={`${imageAspectRatio} bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-lg overflow-hidden mb-4 relative`}>
                    {img?.url ? (
                      <Image
                        src={img.url}
                        alt={img.altText || p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-2xl text-accent-dark">{p.title}</h3>
                    <div className="text-accent-orange font-semibold">
                      ${p.price} {p.currency}
                    </div>
                  </div>
                </Link>
              )
            })}
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

