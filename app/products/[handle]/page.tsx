import { getProductByHandle, getAllProductHandles } from "@/lib/shopify"
import { AddToCartButton } from "@/app/components/AddToCartButton"
import { ProductImageGallery } from "@/app/components/ProductImageGallery"
import { notFound } from "next/navigation"

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    title: `${product.title} | Burning Palms`,
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
