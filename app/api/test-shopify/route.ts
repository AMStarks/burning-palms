import { NextResponse } from "next/server"
import { getProducts } from "@/lib/shopify"
import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export async function GET() {
  try {
    console.log("Testing Shopify connection...")
    console.log("SHOPIFY_STORE_DOMAIN:", process.env.SHOPIFY_STORE_DOMAIN)
    console.log("SHOPIFY_STOREFRONT_ACCESS_TOKEN:", process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "✓ Set" : "✗ Missing")

    // Test direct API call to see raw response
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!storeDomain || !accessToken) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        env: {
          storeDomain: storeDomain || "NOT SET",
          hasToken: !!accessToken,
        }
      }, { status: 500 })
    }

    // Try both public and private token configurations
    // For server-side, we should use private token, but let's test both
    // For server-side Storefront API, use the private token (shpat_...)
    // The publicAccessToken parameter accepts both public and private tokens
    const testClient = createStorefrontApiClient({
      storeDomain: storeDomain,
      apiVersion: '2026-01',
      publicAccessToken: accessToken,
    })
    
    console.log("Client config:", {
      storeDomain: storeDomain,
      apiVersion: '2024-01',
      tokenPrefix: accessToken?.substring(0, 10),
      tokenLength: accessToken?.length,
    })

    // Try a simple query first to test connection
    // Note: Storefront API doesn't have 'status' or 'publishedAt' fields
    const testQuery = `
      query {
        shop {
          name
        }
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `

    let rawResponse: any
    try {
      rawResponse = await testClient.request(testQuery)
      console.log("Raw API Response Type:", typeof rawResponse)
      console.log("Raw API Response Keys:", rawResponse ? Object.keys(rawResponse) : "null")
      console.log("Raw API Response:", JSON.stringify(rawResponse, null, 2).substring(0, 1000))
    } catch (apiError: any) {
      console.error("API Error Details:", {
        message: apiError.message,
        networkStatusCode: apiError.networkStatusCode,
        errors: apiError.errors,
        response: apiError.response,
        fullError: apiError,
      })
      
      return NextResponse.json({
        success: false,
        error: "API Request Failed",
        apiError: apiError.message,
        networkStatusCode: apiError.networkStatusCode,
        apiErrorDetails: apiError.errors || apiError.response || apiError,
        recommendation: apiError.networkStatusCode === 401 
          ? "Token authentication failed. Ensure SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local matches the PRIVATE token (shpat_...) from Storefront API settings."
          : "Check error details above",
        env: {
          storeDomain: storeDomain,
          hasToken: !!accessToken,
          tokenPrefix: accessToken?.substring(0, 10) || "none",
          tokenLength: accessToken?.length || 0,
        }
      }, { status: 500 })
    }

    // Check for errors first
    if (rawResponse?.errors) {
      return NextResponse.json({
        success: false,
        error: "GraphQL Errors",
        errors: rawResponse.errors,
        fullResponse: rawResponse,
        env: {
          storeDomain: storeDomain,
          hasToken: !!accessToken,
        }
      }, { status: 400 })
    }

    // The response might be directly the data, or wrapped in data property
    const responseData = rawResponse?.data || rawResponse

    if (!responseData) {
      return NextResponse.json({
        success: false,
        error: "Invalid API Response",
        rawResponse: rawResponse,
        responseType: typeof rawResponse,
        responseKeys: rawResponse ? Object.keys(rawResponse) : [],
        env: {
          storeDomain: storeDomain,
          hasToken: !!accessToken,
        }
      }, { status: 500 })
    }

    const products = await getProducts(10)
    
    return NextResponse.json({
      success: true,
      connection: "working",
      shopName: responseData?.shop?.name,
      rawProductsCount: responseData?.products?.edges?.length || 0,
      productsFound: products.length,
      rawProducts: responseData?.products?.edges?.map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
      })) || [],
      processedProducts: products,
      responseStructure: {
        hasDataProperty: !!rawResponse?.data,
        directData: !rawResponse?.data && !!rawResponse,
        keys: rawResponse ? Object.keys(rawResponse) : [],
      },
      fullResponse: rawResponse,
      env: {
        storeDomain: storeDomain,
        hasToken: !!accessToken,
        tokenPrefix: accessToken?.substring(0, 10) || "none",
        tokenLength: accessToken?.length || 0,
      }
    })
  } catch (error: any) {
    console.error("Shopify API Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        storeDomain: process.env.SHOPIFY_STORE_DOMAIN || "NOT SET",
        hasToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      }
    }, { status: 500 })
  }
}
