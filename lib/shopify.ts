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
  apiVersion: '2024-01',
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

/**
 * Fetch all products from Shopify
 */
export async function getProducts(limit = 20): Promise<ShopifyProduct[]> {
  if (!client) {
    console.error('Shopify client not initialized. Check environment variables.')
    return []
  }

  try {
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

    // Check for GraphQL errors
    if (response?.errors) {
      console.error('GraphQL errors:', response.errors)
      return []
    }

    // Handle different response structures
    const responseData = response?.data || response
    if (!responseData?.products) {
      console.error('Unexpected response structure:', response)
      return []
    }

    return responseData.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description || '',
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
  } catch (error) {
    console.error('Error fetching products from Shopify:', error)
    return []
  }
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

    // Check for GraphQL errors
    if (response?.errors) {
      console.error('GraphQL errors:', response.errors)
      return []
    }

    // Handle different response structures
    const responseData = response?.data || response
    if (!responseData?.products) {
      console.error('Unexpected response structure:', response)
      return []
    }

    return responseData.products.edges.map((edge: any) => edge.node.handle)
  } catch (error) {
    console.error('Error fetching product handles from Shopify:', error)
    return []
  }
}
