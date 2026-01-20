import { NextResponse } from "next/server"
import { createStorefrontApiClient } from "@shopify/storefront-api-client"

export async function POST(request: Request) {
  try {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!storeDomain || !accessToken) {
      return NextResponse.json(
        { error: "Missing Shopify environment variables" },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => null)
    const variantId = body?.variantId as string | undefined
    const quantity = Number(body?.quantity ?? 1)

    if (!variantId || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const client = createStorefrontApiClient({
      storeDomain,
      apiVersion: "2026-01",
      publicAccessToken: accessToken,
    })

    const mutation = `
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await client.request(mutation, {
      variables: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    })

    if ((response as any)?.errors) {
      return NextResponse.json(
        { error: "Shopify GraphQL error", details: (response as any).errors },
        { status: 502 }
      )
    }

    const data = (response as any)?.data ?? response
    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl
    const userErrors = data?.cartCreate?.userErrors

    if (userErrors?.length) {
      return NextResponse.json(
        { error: "Shopify user error", details: userErrors },
        { status: 400 }
      )
    }

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Missing checkoutUrl from Shopify response" },
        { status: 502 }
      )
    }

    return NextResponse.json({ checkoutUrl })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(error?.message ?? error) },
      { status: 500 }
    )
  }
}

