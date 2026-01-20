import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch a single menu with its items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          where: { parentId: null }, // Only top-level items
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 })
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    )
  }
}

// PUT - Update a menu (name, location, or items)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, location, items } = body

    // Update menu basic info
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (location !== undefined) updateData.location = location

    // If items are provided, update them
    if (items && Array.isArray(items)) {
      // Delete all existing items
      await prisma.menuItem.deleteMany({
        where: { menuId: id },
      })

      // Create new items (with hierarchy support)
      const createItems = async (parentItems: any[], parentId: string | null = null) => {
        for (let i = 0; i < parentItems.length; i++) {
          const item = parentItems[i]
          const menuItem = await prisma.menuItem.create({
            data: {
              menuId: id,
              label: item.label,
              url: item.url,
              order: item.order ?? i,
              parentId: parentId,
            },
          })

          // Recursively create children
          if (item.children && item.children.length > 0) {
            await createItems(item.children, menuItem.id)
          }
        }
      }

      await createItems(items)
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    return NextResponse.json(menu)
  } catch (error) {
    console.error("Error updating menu:", error)
    return NextResponse.json(
      { error: "Failed to update menu" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a menu and all its items
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Items will be deleted automatically due to onDelete: Cascade
    await prisma.menu.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu:", error)
    return NextResponse.json(
      { error: "Failed to delete menu" },
      { status: 500 }
    )
  }
}
