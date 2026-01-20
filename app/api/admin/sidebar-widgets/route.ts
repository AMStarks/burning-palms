import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all sidebar widgets, ordered by order
export async function GET(request: NextRequest) {
  try {
    const widgets = await prisma.sidebarWidget.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(widgets)
  } catch (error: any) {
    console.error("Error fetching sidebar widgets:", error)
    console.error("Error stack:", error?.stack)
    console.error("Error code:", error?.code)
    return NextResponse.json(
      { 
        error: "Failed to fetch sidebar widgets",
        details: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

// PUT - Update all sidebar widgets (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { widgets } = body

    if (!Array.isArray(widgets)) {
      return NextResponse.json(
        { error: "Widgets must be an array" },
        { status: 400 }
      )
    }

    // Delete all existing widgets
    await prisma.sidebarWidget.deleteMany({})

    // Create new widgets
    const updatedWidgets = await Promise.all(
      widgets.map((widget: any, index: number) =>
        prisma.sidebarWidget.create({
          data: {
            title: widget.title || null,
            type: widget.type || "links",
            content: widget.content || null,
            order: widget.order ?? index,
          },
        })
      )
    )

    return NextResponse.json(updatedWidgets)
  } catch (error: any) {
    console.error("Error updating sidebar widgets:", error)
    console.error("Error stack:", error?.stack)
    console.error("Error code:", error?.code)
    console.error("Error message:", error?.message)
    return NextResponse.json(
      { 
        error: "Failed to update sidebar widgets",
        details: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    )
  }
}
