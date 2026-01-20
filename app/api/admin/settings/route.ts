import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Auth temporarily disabled
    const settings = await prisma.setting.findMany({
      orderBy: { category: "asc" },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Auth temporarily disabled
    const body = await request.json()
    const updates = body.settings as Array<{ key: string; value: string; category?: string; type?: string }>

    const results = await Promise.all(
      updates.map(({ key, value, category, type }) =>
        prisma.setting.upsert({
          where: { key },
          update: { 
            value,
            // Only update category/type if provided
            ...(category && { category }),
            ...(type && { type }),
          },
          create: {
            key,
            value,
            type: type || "string",
            category: category || "general",
          },
        })
      )
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

