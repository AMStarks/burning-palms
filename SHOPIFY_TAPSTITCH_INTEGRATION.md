# Shopify & Tapstitch POD Integration Guide

## Overview

This document outlines how to integrate Shopify with Tapstitch Print-on-Demand (POD) services and connect it to your Burning Palms website.

---

## 1. Understanding the Integration Architecture

### Tapstitch → Shopify → Your Website

```
┌─────────────┐
│  Tapstitch  │  (Product Creation & Design)
│   Platform  │
└──────┬──────┘
       │ Auto-sync via Shopify App
       ▼
┌─────────────┐
│   Shopify   │  (E-commerce Backend)
│    Store    │
└──────┬──────┘
       │ Storefront API
       ▼
┌─────────────┐
│   Your      │  (Burning Palms Website)
│   Website   │
└─────────────┘
```

---

## 2. Where to Create Products

### **Primary Location: Tapstitch Platform**

**Why Tapstitch First?**
- Tapstitch is your POD provider - they handle design, printing, and fulfillment
- Their Shopify app automatically syncs products to Shopify
- Design tools are built into Tapstitch's platform
- Product images and mockups are generated automatically

**Product Creation Flow in Tapstitch:**
1. **Design Phase**: Create your designs using Tapstitch's design tools
2. **Product Selection**: Choose base products (tees, hoodies, joggers, etc.)
3. **Apply Designs**: Place your designs on the products
4. **Generate Mockups**: Tapstitch creates product images automatically
5. **Publish to Shopify**: Click "Add to Shopify" - product syncs automatically

### **Secondary Location: Shopify Admin (Optional)**

You can also create products directly in Shopify Admin, but this is **NOT recommended** for POD products because:
- You'd need to manually sync with Tapstitch
- Product images and variants might not match Tapstitch's inventory
- Order fulfillment won't be automatic

**When to use Shopify Admin:**
- Non-POD products (if you add any in the future)
- Manual product edits (pricing, descriptions, SEO)
- Product organization (collections, tags)

---

## 3. Payment & Checkout Options

### **Using Shopify for Payments**

Yes! You can absolutely use Shopify's merchant capabilities for payment processing. Here are your options:

#### **Option A: Shopify Checkout (Recommended for Full Integration)**

**How it works:**
- Customers add products to cart on your website
- Cart is managed via Shopify Cart API
- Checkout redirects to Shopify's secure checkout page
- Shopify processes payment (Shopify Payments, Stripe, PayPal, etc.)
- Customer returns to your site after payment

**Pros:**
- ✅ Full Shopify payment processing (Shopify Payments, multiple gateways)
- ✅ Secure, PCI-compliant checkout
- ✅ Automatic tax calculation
- ✅ Shipping rate calculation
- ✅ Order management in Shopify Admin
- ✅ Automatic fulfillment sync with Tapstitch
- ✅ Customer accounts and order history

**Cons:**
- ⚠️ Redirects away from your site (but can be styled to match your brand)
- ⚠️ Less control over checkout experience

**Implementation:**
```typescript
// Add to cart functionality
async function addToCart(variantId: string, quantity: number) {
  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: variantId, quantity }]
    })
  })
  return response.json()
}

// Redirect to Shopify checkout
function goToCheckout() {
  window.location.href = `https://${SHOPIFY_STORE_DOMAIN}/checkout`
}
```

#### **Option B: Shopify Buy Button (Embedded Checkout)**

**How it works:**
- Embed Shopify Buy Button on your product pages
- Opens a modal/overlay checkout
- Payment processed by Shopify
- Stays on your site (no redirect)

**Pros:**
- ✅ Stays on your website
- ✅ Quick to implement
- ✅ Full Shopify payment processing

**Cons:**
- ⚠️ Less customization
- ⚠️ Modal/overlay experience (some customers prefer full page)

#### **Option C: Custom Checkout with Shopify Payments API (Advanced)**

**How it works:**
- Build custom checkout on your site
- Use Shopify Payments API directly
- Full control over checkout experience

**Pros:**
- ✅ Complete control over checkout UX
- ✅ Stays on your site
- ✅ Custom branding

**Cons:**
- ⚠️ Complex implementation
- ⚠️ Requires PCI compliance considerations
- ⚠️ More development time
- ⚠️ May require Shopify Plus for some features

**When to use:** Only if you need a completely custom checkout experience and have development resources.

---

### **Recommended Approach: Shopify Checkout (Option A)**

For your Burning Palms site, I recommend **Option A (Shopify Checkout)** because:

1. **Seamless Integration**: Works perfectly with Tapstitch fulfillment
2. **Payment Processing**: Shopify handles all payment gateways
3. **Order Management**: All orders appear in Shopify Admin
4. **Automatic Fulfillment**: Orders automatically sync to Tapstitch
5. **Tax & Shipping**: Automatic calculation
6. **Customer Experience**: Trusted, secure checkout

**The flow:**
```
Your Website → Add to Cart → Shopify Cart API → 
Redirect to Shopify Checkout → Payment Processed → 
Order Created in Shopify → Auto-sync to Tapstitch → 
Fulfillment → Customer Receives Product
```

---

## 4. Complete Product Flow

### **Step-by-Step Workflow**

#### **Phase 1: Product Creation (Tapstitch)**

1. **Log into Tapstitch Platform**
   - Access your Tapstitch account
   - Navigate to the design/product creation area

2. **Create Your Design**
   - Upload your artwork/design files
   - Use Tapstitch's design tools to customize
   - Ensure designs meet quality requirements (high-resolution, proper format)

3. **Select Base Products**
   - Choose from Tapstitch's catalog (tees, hoodies, joggers, etc.)
   - Select sizes and color options available
   - Review product specifications (fabric, fit, etc.)

4. **Apply Design to Products**
   - Place your design on the selected products
   - Adjust positioning, sizing, and placement
   - Preview how it looks on different products

5. **Generate Product Mockups**
   - Tapstitch automatically generates product images
   - Review mockups for quality and accuracy
   - Optionally order samples before publishing

6. **Publish to Shopify**
   - Click "Add to Shopify" or "Publish" button
   - Tapstitch app syncs product to your Shopify store
   - Product appears in Shopify Admin automatically

#### **Phase 2: Product Management (Shopify)**

1. **Product Appears in Shopify Admin**
   - Navigate to Shopify Admin → Products
   - Product is automatically created with:
     - Title (from Tapstitch)
     - Description (from Tapstitch)
     - Images (mockups from Tapstitch)
     - Variants (sizes, colors)
     - Pricing (set your markup)

2. **Customize Product Details** (Optional but Recommended)
   - **Edit Title**: Optimize for SEO and branding
   - **Edit Description**: Add compelling copy, sizing info, care instructions
   - **Set Pricing**: Add your markup to Tapstitch's base cost
   - **Add Tags**: For collections and filtering
   - **Add to Collections**: Organize products (e.g., "Summer Collection", "Hoodies")
   - **SEO Settings**: Meta title, description, URL handle

3. **Product Status**
   - Set product to "Active" to make it available for purchase
   - Products are automatically linked to Tapstitch for fulfillment

#### **Phase 3: Display on Website (Your Next.js Site)**

1. **Fetch Products from Shopify**
   - Use Shopify Storefront API (GraphQL) to fetch products
   - Query products, variants, images, prices
   - Cache products for performance

2. **Display Products**
   - Render products in your `ProductsSection` component
   - Use product data from Shopify instead of mock data
   - Maintain your existing design system and styling

3. **Product Pages**
   - Create dynamic product detail pages (`/products/[handle]`)
   - Display full product information, images, variants
   - Add to cart functionality (Shopify Buy Button or Storefront API)

---

## 4. Technical Implementation

### **A. Shopify Storefront API Setup**

**Required:**
- Shopify Store URL (e.g., `your-store.myshopify.com`)
- Storefront API Access Token (from Shopify Admin → Apps → Develop apps → Storefront API)

**Install Shopify SDK:**
```bash
npm install @shopify/storefront-api-client
```

**Environment Variables:**
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com  # For client-side cart API
```

### **B. Fetch Products in Your Website**

**Create `lib/shopify.ts`:**
```typescript
import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-01',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

export async function getProducts(limit = 20) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await client.request(query, {
    variables: { first: limit },
  })

  return response.data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    description: edge.node.description,
    price: edge.node.priceRange.minVariantPrice.amount,
    currency: edge.node.priceRange.minVariantPrice.currencyCode,
    images: edge.node.images.edges.map((img: any) => ({
      url: img.node.url,
      altText: img.node.altText,
    })),
    variants: edge.node.variants.edges.map((v: any) => ({
      id: v.node.id,
      title: v.node.title,
      price: v.node.price.amount,
      available: v.node.availableForSale,
    })),
  }))
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `

  const response = await client.request(query, {
    variables: { handle },
  })

  return response.data.product
}
```

### **C. Update ProductsSection Component**

**Modify `app/components/page-sections/ProductsSection.tsx`:**
```typescript
import { getProducts } from "@/lib/shopify"

export async function ProductsSection({ settings, content }: ProductsSectionProps) {
  // ... existing padding/spacing code ...

  const productCount = content?.productCount || 6
  
  // Fetch real products from Shopify instead of mock data
  const products = await getProducts(productCount)

  // ... rest of component using real product data ...
}
```

### **D. Create Product Detail Pages**

**Create `app/products/[handle]/page.tsx`:**
```typescript
import { getProductByHandle } from "@/lib/shopify"
import Image from "next/image"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {product.images.map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={image.altText || product.title}
              width={800}
              height={800}
              className="w-full"
            />
          ))}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl mb-6">${product.price} {product.currency}</p>
          <div className="mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          
          {/* Variants & Add to Cart */}
          {/* Implement variant selection and cart functionality */}
        </div>
      </div>
    </div>
  )
}
```

---

## 6. Order Fulfillment Flow

### **Automatic Fulfillment (Tapstitch)**

1. **Customer Places Order** on your website
2. **Order Sent to Shopify** (via Storefront API or Buy Button)
3. **Shopify Notifies Tapstitch** automatically (via Tapstitch app)
4. **Tapstitch Produces & Ships** the product
5. **Tracking Info Updated** in Shopify
6. **Customer Receives** tracking notification

**No manual intervention required!**

---

## 7. Best Practices

### **Product Creation**
- ✅ Create products in Tapstitch first
- ✅ Order samples before publishing
- ✅ Use high-quality designs (300 DPI minimum)
- ✅ Test different product placements
- ✅ Review mockups carefully

### **Product Management**
- ✅ Customize titles and descriptions in Shopify
- ✅ Add SEO-friendly meta descriptions
- ✅ Organize products into collections
- ✅ Set competitive pricing (consider Tapstitch base cost + your markup)
- ✅ Regularly review and update product information

### **Website Integration**
- ✅ Cache Shopify product data (use Next.js caching)
- ✅ Implement proper error handling
- ✅ Show loading states while fetching products
- ✅ Optimize product images (use Next.js Image component)
- ✅ Implement product search and filtering

### **Performance**
- ✅ Use Shopify Storefront API (faster than Admin API)
- ✅ Implement ISR (Incremental Static Regeneration) for product pages
- ✅ Cache product lists and details
- ✅ Use CDN for product images (Shopify provides this)

---

## 8. Next Steps for Implementation

1. **Set up Tapstitch Account**
   - Sign up at tapstitch.com
   - Install Tapstitch Shopify app
   - Connect your Shopify store

2. **Set up Shopify Storefront API**
   - Get Storefront API access token
   - Add environment variables
   - Install Shopify SDK

3. **Create First Product in Tapstitch**
   - Design your first product
   - Publish to Shopify
   - Verify it appears in Shopify Admin

4. **Update Website Code**
   - Create `lib/shopify.ts` with API functions
   - Update `ProductsSection` to fetch real products
   - Create product detail pages
   - Implement Add to Cart functionality
   - Set up Shopify checkout redirect
   - Test product display and checkout flow

5. **Test End-to-End**
   - Create test product in Tapstitch
   - Verify it appears on website
   - Test product page display
   - Test add to cart (if implemented)

---

## 9. Additional Resources

- **Tapstitch Help Center**: https://www.tapstitch.com/help-center
- **Shopify Storefront API Docs**: https://shopify.dev/docs/api/storefront
- **Shopify App Store (Tapstitch)**: https://apps.shopify.com/odmpod-dropshipping
- **Next.js + Shopify Guide**: https://shopify.dev/docs/custom-storefronts

---

## 10. Automatic Product Page Generation

### **How Products Sync to Your Website**

Yes! When products are created in Shopify (synced from Tapstitch), they will automatically be available on your website. Here's how:

#### **Automatic Product Page Creation**

**How it works:**
1. **Product Created in Tapstitch** → Auto-syncs to Shopify
2. **Product Available in Shopify** → Accessible via Storefront API
3. **Dynamic Page Generation** → Next.js creates pages on-demand using product handles
4. **Product Pages Live** → Customers can view and purchase

**No manual page creation needed!** Next.js dynamic routes handle this automatically.

#### **Implementation: Dynamic Product Pages**

**Create `app/products/[handle]/page.tsx`:**
```typescript
import { getProductByHandle, getAllProductHandles } from "@/lib/shopify"
import Image from "next/image"
import { AddToCartButton } from "@/app/components/AddToCartButton"
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
      {/* Product Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altText || product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
                      >
                        <Image
                          src={image.url}
                          alt={image.altText || `${product.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

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
```

**Update `lib/shopify.ts` to include helper function:**
```typescript
// ... existing code ...

export async function getAllProductHandles(): Promise<string[]> {
  const query = `
    query getAllProductHandles($first: Int!) {
      products(first: $first) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `

  const response = await client.request(query, {
    variables: { first: 250 }, // Shopify allows up to 250 products per query
  })

  return response.data.products.edges.map((edge: any) => edge.node.handle)
}
```

#### **Product Listing Page**

**Create `app/products/page.tsx`:**
```typescript
import { getProducts } from "@/lib/shopify"
import Image from "next/image"
import Link from "next/link"
import { getProductGridClasses, getProductCardClasses, getProductImageAspectRatio } from "@/lib/shop-settings"
import { getProductDisplaySettings } from "@/lib/shop-settings"

export default async function ProductsPage() {
  const productSettings = await getProductDisplaySettings()
  const products = await getProducts(50) // Fetch up to 50 products
  const gridClasses = getProductGridClasses(productSettings)
  const cardClasses = getProductCardClasses(productSettings)
  const imageAspectRatio = getProductImageAspectRatio(productSettings)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-5xl md:text-6xl text-accent-dark mb-12 text-center">
          Shop the Collection
        </h1>

        {products.length > 0 ? (
          <div className={gridClasses}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className={cardClasses}
              >
                <div className={`${imageAspectRatio} bg-gray-100 rounded-lg overflow-hidden mb-4`}>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl text-accent-dark mb-2">
                  {product.title}
                </h3>
                <p className="text-lg font-semibold text-accent-orange">
                  ${product.price} {product.currency}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Products will appear here once they're added to Shopify.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Revalidate every 60 seconds
export const revalidate = 60
```

#### **Update ProductsSection to Link to Product Pages**

**Modify `app/components/page-sections/ProductsSection.tsx`:**
```typescript
import { getProducts } from "@/lib/shopify"
import Link from "next/link"
import Image from "next/image"
// ... existing imports ...

export async function ProductsSection({ settings, content }: ProductsSectionProps) {
  // ... existing padding/spacing code ...

  const productCount = content?.productCount || 6
  
  // Fetch real products from Shopify
  const products = await getProducts(productCount)

  // ... existing grid classes code ...

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
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className={cardClasses}
            >
              <div className={`${imageAspectRatio} bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden`}>
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
              <h3 className="font-display text-2xl text-accent-dark mb-2">
                {product.title}
              </h3>
              <p className="text-lg font-semibold text-accent-orange mb-2">
                ${product.price} {product.currency}
              </p>
              <p className="text-foreground/70">View Details →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### **How It Works: Automatic Sync**

1. **Product Created in Tapstitch**
   - You design and publish a product
   - Tapstitch syncs it to Shopify automatically

2. **Product Available in Shopify**
   - Product appears in Shopify Admin
   - Accessible via Storefront API immediately

3. **Next.js Fetches Products**
   - Your website queries Shopify Storefront API
   - Products are fetched dynamically or cached

4. **Dynamic Pages Generated**
   - Next.js creates `/products/[handle]` pages on-demand
   - Uses ISR (Incremental Static Regeneration) for performance
   - Pages revalidate every 60 seconds to catch new products

5. **Product Pages Live**
   - Customers can view product details
   - Add to cart and checkout via Shopify

### **Sync Frequency**

- **Real-time**: Products are available via API immediately after sync
- **Page Regeneration**: Next.js revalidates pages every 60 seconds (configurable)
- **Manual Refresh**: You can trigger a rebuild to update immediately

### **Benefits**

✅ **Automatic**: No manual page creation needed
✅ **SEO-Friendly**: Static pages with proper metadata
✅ **Fast**: ISR provides fast page loads
✅ **Always Up-to-Date**: Revalidates regularly
✅ **Scalable**: Handles unlimited products

---

## Summary

**Product Creation Location:** Tapstitch Platform (primary) → Shopify Admin (customization)

**Product Flow:**
1. Design in Tapstitch → 2. Auto-sync to Shopify → 3. Customize in Shopify → 4. Display on Website via Storefront API → 5. **Automatic Product Pages Created**

**Key Takeaway:** Create products in Tapstitch, let them sync to Shopify automatically, then fetch and display them on your website using Shopify's Storefront API. **Product pages are created automatically** using Next.js dynamic routes - no manual page creation needed!
