import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

// GET - Fetch all page sections (for homepage if pageId is null)
export async function GET(request: NextRequest) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const pageIdParam = searchParams.get("pageId")
    // For homepage, pageId should be null in database
    const pageId = pageIdParam === "" || pageIdParam === null || !pageIdParam ? null : pageIdParam

    console.log("Fetching sections for pageId:", pageId, "type:", typeof pageId)

    // Build where clause - handle null pageId properly
    const whereClause = pageId === null ? { pageId: null } : { pageId: pageId }

    console.log("Where clause:", JSON.stringify(whereClause))

    const sections = await prisma.pageSection.findMany({
      where: whereClause,
      orderBy: { order: "asc" },
    })

    console.log(`Found ${sections.length} sections`)
    return NextResponse.json(sections)
  } catch (error: any) {
    console.error("Error fetching page sections:", error)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    console.error("Error stack:", error?.stack)
    return NextResponse.json(
      { 
        error: "Failed to fetch page sections",
        details: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

// PUT - Update all page sections (bulk update for reordering)
export async function PUT(request: NextRequest) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const body = await request.json()
    const { sections } = body

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Sections must be an array" },
        { status: 400 }
      )
    }

    // Delete all existing sections for this page
    const pageId = sections[0]?.pageId || null
    await prisma.pageSection.deleteMany({
      where: { pageId: pageId || null },
    })

    // Create/update sections with new order
    const updatedSections = await Promise.all(
      sections.map((section: any, index: number) =>
        prisma.pageSection.upsert({
          where: { id: section.id },
          create: {
            pageId: section.pageId || null,
            type: section.type,
            order: index,
            settings: section.settings || null,
            content: section.content || null,
            visible: section.visible !== false,
          },
          update: {
            order: index,
            settings: section.settings || null,
            content: section.content || null,
            visible: section.visible !== false,
          },
        })
      )
    )

    return NextResponse.json(updatedSections)
  } catch (error) {
    console.error("Error updating page sections:", error)
    return NextResponse.json(
      { error: "Failed to update page sections" },
      { status: 500 }
    )
  }
}

// POST - Create a new page section
export async function POST(request: NextRequest) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const body = await request.json()
    const { pageId, type, settings, content } = body

    // Get the highest order number
    const lastSection = await prisma.pageSection.findFirst({
      where: { pageId: pageId || null },
      orderBy: { order: "desc" },
    })

    const newOrder = lastSection ? lastSection.order + 1 : 0

    const section = await prisma.pageSection.create({
      data: {
        pageId: pageId || null,
        type: type || "text",
        order: newOrder,
        settings: settings || null,
        content: content || null,
        visible: true,
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error("Error creating page section:", error)
    return NextResponse.json(
      { error: "Failed to create page section" },
      { status: 500 }
    )
  }
}
