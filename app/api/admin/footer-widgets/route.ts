import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all footer widgets, ordered by column and order
export async function GET(request: NextRequest) {
  try {
    console.log("Fetching footer widgets...")
    const widgets = await prisma.footerWidget.findMany({
      orderBy: [
        { columnIndex: "asc" },
        { order: "asc" },
      ],
    })
    console.log(`Found ${widgets.length} widgets`)
    return NextResponse.json(widgets)
  } catch (error: any) {
    console.error("Error fetching footer widgets:", error)
    console.error("Error stack:", error?.stack)
    console.error("Error code:", error?.code)
    return NextResponse.json(
      { 
        error: "Failed to fetch footer widgets", 
        details: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

// POST - Create or update footer widgets (bulk operation)
export async function POST(request: NextRequest) {
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
    await prisma.footerWidget.deleteMany({})

    // Create new widgets
    const createdWidgets = await Promise.all(
      widgets.map((widget: any) =>
        prisma.footerWidget.create({
          data: {
            columnIndex: widget.columnIndex ?? widget.column ?? 0,
            title: widget.title || null,
            type: widget.type || "links",
            content: widget.content || null,
            order: widget.order || 0,
          },
        })
      )
    )

    return NextResponse.json(createdWidgets, { status: 201 })
  } catch (error) {
    console.error("Error saving footer widgets:", error)
    return NextResponse.json(
      { error: "Failed to save footer widgets" },
      { status: 500 }
    )
  }
}

// PUT - Update all footer widgets (bulk update)
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
    await prisma.footerWidget.deleteMany({})

    // Create new widgets
    const updatedWidgets = await Promise.all(
      widgets.map((widget: any) =>
        prisma.footerWidget.create({
          data: {
            columnIndex: widget.columnIndex,
            title: widget.title || null,
            type: widget.type || "links",
            content: widget.content || null,
            order: widget.order || 0,
          },
        })
      )
    )

    return NextResponse.json(updatedWidgets)
  } catch (error) {
    console.error("Error updating footer widgets:", error)
    return NextResponse.json(
      { error: "Failed to update footer widgets" },
      { status: 500 }
    )
  }
}
