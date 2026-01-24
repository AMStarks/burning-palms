import { createStorefrontApiClient } from '@shopify/storefront-api-client'

// Check for required environment variables
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!storeDomain || !accessToken) {
  console.error('Missing Shopify environment variables!')
  console.error('SHOPIFY_STORE_DOMAIN:', storeDomain ? '✓' : '✗ MISSING')
  console.error('SHOPIFY_STOREFRONT_ACCESS_TOKEN:', accessToken ? '✓' : '✗ MISSING')
  console.error('Please create a .env.local file with these variables')
}

// For Storefront API, we need the Storefront API access token (not Admin API token)
// This token should come from: Sales Channels → Headless → Your Storefront → Settings
const client = storeDomain && accessToken ? createStorefrontApiClient({
  storeDomain: storeDomain,
  apiVersion: '2026-01',
  publicAccessToken: accessToken, // Storefront API token (usually alphanumeric, not shpat_...)
}) : null

export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  price: string
  currency: string
  images: Array<{
    url: string
    altText: string | null
  }>
  variants: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

type ShopifyProductPage = {
  products: ShopifyProduct[]
  hasNextPage: boolean
  endCursor: string | null
}

async function fetchProductsPage(first: number, after?: string | null): Promise<ShopifyProductPage> {
  if (!client) {
    console.error("Shopify client not initialized. Check environment variables.")
    return { products: [], hasNextPage: false, endCursor: null }
  }

  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
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
    variables: { first, after: after || null },
  })

  if (response?.errors) {
    console.error("GraphQL errors:", response.errors)
    return { products: [], hasNextPage: false, endCursor: null }
  }

  const responseData = response?.data || response
  const productsNode = responseData?.products
  if (!productsNode) {
    console.error("Unexpected response structure:", response)
    return { products: [], hasNextPage: false, endCursor: null }
  }

  const products: ShopifyProduct[] = productsNode.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    description: edge.node.description || "",
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

  return {
    products,
    hasNextPage: !!productsNode.pageInfo?.hasNextPage,
    endCursor: productsNode.pageInfo?.endCursor || null,
  }
}

/**
 * Fetch all products from Shopify
 */
export async function getProducts(limit = 20): Promise<ShopifyProduct[]> {
  try {
    const page = await fetchProductsPage(Math.min(250, Math.max(1, limit)), null)
    return page.products
  } catch (error) {
    console.error('Error fetching products from Shopify:', error)
    return []
  }
}

/**
 * Fetch ALL products from Shopify (paginated). Use this for /shop.
 * Safety: stops at maxProducts to avoid very large fetches causing timeouts.
 */
export async function getAllProducts(maxProducts = 2000): Promise<ShopifyProduct[]> {
  if (!client) {
    console.error("Shopify client not initialized. Check environment variables.")
    return []
  }

  const all: ShopifyProduct[] = []
  let after: string | null = null
  let hasNextPage = true

  try {
    while (hasNextPage && all.length < maxProducts) {
      const remaining = maxProducts - all.length
      const first = Math.min(250, remaining)
      const page = await fetchProductsPage(first, after)
      all.push(...page.products)
      hasNextPage = page.hasNextPage
      after = page.endCursor
      if (page.products.length === 0) break
    }
  } catch (error) {
    console.error("Error fetching all products from Shopify:", error)
  }

  return all
}

/**
 * Get a single product by handle
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!client) {
    console.error('Shopify client not initialized. Check environment variables.')
    return null
  }

  try {
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

    // Check for GraphQL errors
    if (response?.errors) {
      console.error('GraphQL errors:', response.errors)
      return null
    }

    // Handle different response structures
    const responseData = response?.data || response
    if (!responseData?.product) {
      return null
    }

    const product = responseData.product

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description || '',
      price: product.priceRange.minVariantPrice.amount,
      currency: product.priceRange.minVariantPrice.currencyCode,
      images: product.images.edges.map((img: any) => ({
        url: img.node.url,
        altText: img.node.altText,
      })),
      variants: product.variants.edges.map((v: any) => ({
        id: v.node.id,
        title: v.node.title,
        price: v.node.price.amount,
        available: v.node.availableForSale,
      })),
    }
  } catch (error) {
    console.error('Error fetching product from Shopify:', error)
    return null
  }
}

/**
 * Get all product handles (for static generation)
 */
export async function getAllProductHandles(): Promise<string[]> {
  if (!client) {
    console.error('Shopify client not initialized. Check environment variables.')
    return []
  }

  try {
    const query = `
      query getAllProductHandles($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              handle
            }
          }
        }
      }
    `

    const handles: string[] = []
    let after: string | null = null
    let hasNextPage = true
    const maxHandles = 5000 // safety cap

    while (hasNextPage && handles.length < maxHandles) {
      const first = Math.min(250, maxHandles - handles.length)
      const response: any = await client.request(query, {
        variables: { first, after: after || null },
      })

      if (response?.errors) {
        console.error("GraphQL errors:", response.errors)
        return handles
      }

      const responseData: any = response?.data || response
      const productsNode: any = responseData?.products
      if (!productsNode) {
        console.error("Unexpected response structure:", response)
        return handles
      }

      handles.push(...productsNode.edges.map((edge: any) => edge.node.handle))
      hasNextPage = !!productsNode.pageInfo?.hasNextPage
      after = productsNode.pageInfo?.endCursor || null
      if (productsNode.edges.length === 0) break
    }

    return handles
  } catch (error) {
    console.error('Error fetching product handles from Shopify:', error)
    return []
  }
}
