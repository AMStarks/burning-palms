import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

// GET - Fetch a single section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = await params
    const section = await prisma.pageSection.findUnique({
      where: { id },
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error("Error fetching section:", error)
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    )
  }
}

// PUT - Update a single section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = await params
    const body = await request.json()
    const { settings, content, visible, order } = body

    const section = await prisma.pageSection.update({
      where: { id },
      data: {
        settings: settings !== undefined ? settings : undefined,
        content: content !== undefined ? content : undefined,
        visible: visible !== undefined ? visible : undefined,
        order: order !== undefined ? order : undefined,
      },
    })

    return NextResponse.json(section)
  } catch (error: any) {
    console.error("Error updating section:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = await params
    await prisma.pageSection.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting section:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    )
  }
}
