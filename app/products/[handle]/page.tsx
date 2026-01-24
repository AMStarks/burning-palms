import { getProductByHandle, getAllProductHandles } from "@/lib/shopify"
import { AddToCartButton } from "@/app/components/AddToCartButton"
import { ProductImageGallery } from "@/app/components/ProductImageGallery"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getSiteSettings } from "@/lib/settings"
import { getLayoutSettings, getContainerWidthClass } from "@/lib/layout-settings"
import { getHeaderFooterSettings, getHeaderClasses } from "@/lib/header-footer-settings"
import { getMenuByLocation } from "@/lib/menus"
import { Menu } from "@/app/components/Menu"

// Generate static paths for all products (for better SEO)
export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles()
    return handles.map((handle) => ({
      handle: handle,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Revalidate pages every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const siteSettings = await getSiteSettings()
  const layoutSettings = await getLayoutSettings()
  const headerFooterSettings = await getHeaderFooterSettings()
  const headerMenu = await getMenuByLocation("header")
  const containerClass = getContainerWidthClass(layoutSettings.containerWidth || "7xl")
  const headerClasses = getHeaderClasses(headerFooterSettings)

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

      <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery images={product.images} productTitle={product.title} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-accent-dark mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-semibold text-accent-orange mb-6">
                ${product.price} {product.currency}
              </p>
            </div>

            {/* Product Description */}
            {product.description && (
              <div
                className="prose prose-lg max-w-none text-foreground/80"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Variants & Add to Cart */}
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.title,
    description: product.description
      ? product.description.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Shop ${product.title} at Burning Palms`,
    openGraph: {
      title: product.title,
      description: product.description
        ? product.description.replace(/<[^>]*>/g, "").substring(0, 160)
        : undefined,
      images: product.images && product.images.length > 0
        ? [{ url: product.images[0].url }]
        : [],
    },
  }
}
