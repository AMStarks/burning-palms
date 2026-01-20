import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getProductDisplaySettings, getProductGridClasses, getProductCardClasses, getProductImageAspectRatio } from "@/lib/shop-settings";
import { getLayoutSettings, getContainerWidthClass, getContentWidthClass } from "@/lib/layout-settings";
import { getHeaderFooterSettings, getHeaderClasses, getFooterGridStyle } from "@/lib/header-footer-settings";
import { getMenuByLocation } from "@/lib/menus";
import { Menu } from "@/app/components/Menu";
import { getFooterWidgets } from "@/lib/footer-widgets";
import { FooterWidget } from "@/app/components/FooterWidget";
import { getSidebarWidgets } from "@/lib/sidebar-widgets";
import { SidebarWidget } from "@/app/components/SidebarWidget";
import { getSidebarLayoutClasses } from "@/lib/layout-settings";
import { getPageSections } from "@/lib/page-sections";
import { SectionRenderer } from "@/app/components/page-sections";

// Mark as dynamic to prevent static generation issues with database
export const dynamic = 'force-dynamic'

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const productSettings = await getProductDisplaySettings();
  const layoutSettings = await getLayoutSettings();
  const headerFooterSettings = await getHeaderFooterSettings();
  const headerMenu = await getMenuByLocation("header");
  const footerWidgets = await getFooterWidgets();
  const sidebarWidgets = await getSidebarWidgets();
  const gridClasses = getProductGridClasses(productSettings);
  const cardClasses = getProductCardClasses(productSettings);
  const imageAspectRatio = getProductImageAspectRatio(productSettings);
  const containerClass = getContainerWidthClass(layoutSettings.containerWidth || "7xl");
  const contentClass = getContentWidthClass(layoutSettings.contentWidth || "7xl");
  const headerClasses = getHeaderClasses(headerFooterSettings);
  const footerGridStyle = getFooterGridStyle(headerFooterSettings.footerColumns || 4);
  const sidebarLayout = getSidebarLayoutClasses(layoutSettings);
  const hasSidebar = layoutSettings.sidebarPosition && layoutSettings.sidebarPosition !== "none";
  const pageSections = await getPageSections(null); // Get homepage sections
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={headerClasses.nav}>
        <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
          {headerClasses.layout === "centered" ? (
            // Centered Layout: Logo center, menu below
            <div className={`${headerClasses.height} flex flex-col items-center justify-center`}>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="h-[75px] w-auto">
                  <Image 
                    src={siteSettings.logoUrl} 
                    alt="Burning Palms Logo" 
                    width={133} 
                    height={75}
                    className="object-contain h-full w-auto"
                  />
                </div>
                <div className="font-display text-2xl text-accent-dark">
                  {siteSettings.title.toUpperCase()}
                </div>
              </Link>
              <div className="flex items-center space-x-8">
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
          ) : headerClasses.layout === "split" ? (
            // Split Layout: Logo left, menu & actions right
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
                <div className="font-display text-2xl text-accent-dark">
                  {siteSettings.title.toUpperCase()}
                </div>
              </Link>
              <div className="flex items-center space-x-8">
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
          ) : (
            // Standard Layout: Logo left, menu center, actions right
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
                <div className="font-display text-2xl text-accent-dark">
                  {siteSettings.title.toUpperCase()}
                </div>
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
          )}
        </div>
      </nav>

      {/* Page Sections - Dynamic from Page Builder */}
      <main className="relative">
        {pageSections.length > 0 ? (
          // Render sections from Page Builder
          pageSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        ) : (
          // Fallback to default sections if no sections configured
          <>
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background with retro texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/10 via-background to-accent-orange/10"></div>
          
          {/* Logo Placeholder - will replace with actual logo */}
          <div className="relative z-10 text-center px-4">
            <div className="mb-8">
              <div className="inline-block p-8 bg-background/90 rounded-lg shadow-lg">
                <div className="text-6xl md:text-8xl font-display text-accent-dark mb-4">
                  {siteSettings.title.toUpperCase()}
                </div>
                <div className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
                  {siteSettings.tagline}
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

        {/* Featured Collections */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-center text-accent-dark mb-12">
              SHOP THE COLLECTION
            </h2>
            <div className={gridClasses}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={cardClasses}>
                  <div className={`${imageAspectRatio} bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-lg mb-4 flex items-center justify-center`}>
                    <span className="text-foreground/40">Product Image</span>
                  </div>
                  <h3 className="font-display text-2xl text-accent-dark mb-2">Collection {item}</h3>
                  <p className="text-foreground/70">Shop now →</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-yellow/5 to-accent-orange/5">
          <div className={`${contentClass} mx-auto text-center`}>
            <h2 className="font-display text-4xl md:text-5xl text-accent-dark mb-6">
              AUSTRALIAN SURF CULTURE
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Born from the beaches of Australia, Burning Palms brings you authentic surf and street wear 
              with a retro 70s vibe. Each piece is designed to capture the essence of coastal living 
              and laid-back style.
            </p>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-accent-brown/20 mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className={`${containerClass} mx-auto`}>
          <div className={`${footerGridStyle} mb-8`}>
            {Object.keys(footerWidgets).length > 0 ? (
              // Render widgets from database
              Array.from({ length: headerFooterSettings.footerColumns || 4 }, (_, i) => {
                const columnWidgets = footerWidgets[i] || []
                const widget = columnWidgets[0] // For now, one widget per column
                return widget ? (
                  <FooterWidget key={i} widget={widget} />
                ) : (
                  <div key={i}></div>
                )
              })
            ) : (
              // Fallback to default hardcoded footer
              <>
                <div>
                  <h3 className="font-display text-xl text-accent-dark mb-4">{siteSettings.title.toUpperCase()}</h3>
                  <p className="text-foreground/70 text-sm">
                    {siteSettings.description}
                  </p>
                </div>
            <div>
              <h4 className="font-display text-lg text-accent-dark mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent-orange">New Arrivals</a></li>
                <li><a href="#" className="hover:text-accent-orange">Tops</a></li>
                <li><a href="#" className="hover:text-accent-orange">Bottoms</a></li>
                <li><a href="#" className="hover:text-accent-orange">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg text-accent-dark mb-4">INFO</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent-orange">About Us</a></li>
                <li><a href="#" className="hover:text-accent-orange">Shipping</a></li>
                <li><a href="#" className="hover:text-accent-orange">Returns</a></li>
                <li><a href="#" className="hover:text-accent-orange">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg text-accent-dark mb-4">CONNECT</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-accent-orange">Instagram</a></li>
                <li><a href="#" className="hover:text-accent-orange">Facebook</a></li>
                <li><a href="#" className="hover:text-accent-orange">Newsletter</a></li>
              </ul>
            </div>
                {/* Conditional 5th column - only render if 5 columns are selected */}
                {headerFooterSettings.footerColumns === 5 && (
                  <div>
                    <h4 className="font-display text-lg text-accent-dark mb-4">EXTRA</h4>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li><a href="#" className="hover:text-accent-orange">Placeholder</a></li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="border-t border-accent-brown/20 pt-8 text-center text-sm text-foreground/70">
            <p>{headerFooterSettings.footerCopyrightText || "© 2025 Burning Palms. All rights reserved."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
