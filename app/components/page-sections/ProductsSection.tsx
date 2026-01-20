import { getProductGridClasses, getProductCardClasses, getProductImageAspectRatio } from "@/lib/shop-settings"
import { getProducts, type ShopifyProduct } from "@/lib/shopify"
import Link from "next/link"
import Image from "next/image"

type ProductsSectionProps = {
  settings: any
  content: any
}

export async function ProductsSection({ settings, content }: ProductsSectionProps) {
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

  // Fetch real products from Shopify
  let products: ShopifyProduct[] = []
  try {
    products = await getProducts(productCount)
  } catch (error) {
    console.error("Error fetching products:", error)
    products = []
  }

  const gridClasses = `grid grid-cols-1 md:grid-cols-${columnsDesktop} gap-6`
  const cardClasses = getProductCardClasses({} as any)
  const imageAspectRatio = getProductImageAspectRatio({} as any)

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
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className={cardClasses}
              >
                <div className={`${imageAspectRatio} bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative`}>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-foreground/40">Product Image</span>
                  )}
                </div>
                <h3 className="font-display text-2xl text-accent-dark mb-2">{product.title}</h3>
                <p className="text-lg font-semibold text-accent-orange mb-2">
                  ${product.price} {product.currency}
                </p>
                <p className="text-foreground/70">View Details →</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-foreground/60">No products available yet.</p>
              <p className="text-sm text-foreground/40 mt-2">
                Products will appear here once they're added to Shopify.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
