import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all menus with their items
export async function GET(request: NextRequest) {
  try {
    // If no header menu exists, create a sensible default so the UI shows "existing" items.
    const existingHeader = await prisma.menu.findFirst({
      where: { location: "header" },
    })

    if (!existingHeader) {
      await prisma.menu.create({
        data: {
          name: "Header Menu",
          location: "header",
          items: {
            create: [
              { label: "Shop", url: "/shop", order: 0 },
              { label: "Collections", url: "/shop", order: 1 },
              { label: "About", url: "/about", order: 2 },
              { label: "Contact", url: "/contact", order: 3 },
            ],
          },
        },
      })
    } else {
      // If a header menu already exists but "Shop"/"Collections" still point at Shopify (or #),
      // automatically keep browsing on burningpalms.au by routing to our headless /shop page.
      const shopDomains = ["shop.burningpalms.au", "myshopify.com"]

      const topItems = await prisma.menuItem.findMany({
        where: { menuId: existingHeader.id, parentId: null },
        select: { id: true, label: true, url: true },
      })

      const needsRewrite = (url: string) => {
        const u = (url || "").trim()
        if (!u) return true
        if (u === "#") return true
        const lower = u.toLowerCase()
        return shopDomains.some((d) => lower.includes(d))
      }

      const updates = topItems
        .filter((i) => (i.label === "Shop" || i.label === "Collections") && needsRewrite(i.url))
        .map((i) => i.id)

      if (updates.length > 0) {
        await prisma.menuItem.updateMany({
          where: { id: { in: updates } },
          data: { url: "/shop" },
        })
      }
    }

    const menus = await prisma.menu.findMany({
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error("Error fetching menus:", error)
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    )
  }
}

// POST - Create a new menu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location } = body

    if (!name) {
      return NextResponse.json(
        { error: "Menu name is required" },
        { status: 400 }
      )
    }

    const menu = await prisma.menu.create({
      data: {
        name,
        location: location || null,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    console.error("Error creating menu:", error)
    return NextResponse.json(
      { error: "Failed to create menu" },
      { status: 500 }
    )
  }
}
