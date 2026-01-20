import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error fetching page:", error)
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth temporarily disabled
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = await params
    const body = await request.json()
    const { title, slug, content, excerpt, status, settings } = body

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        settings: settings ? JSON.stringify(settings) : undefined,
        publishedAt: status === "published" ? new Date() : undefined,
      },
      include: { author: { select: { name: true, email: true } } },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error("Error updating page:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth temporarily disabled
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = await params
    
    // Check if this is the homepage (slug === 'home')
    const page = await prisma.page.findUnique({
      where: { id },
      select: { slug: true },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    // Prevent deletion of homepage
    if (page.slug === "home") {
      return NextResponse.json(
        { error: "Homepage cannot be deleted" },
        { status: 400 }
      )
    }

    // Delete associated page sections first
    await prisma.pageSection.deleteMany({
      where: { pageId: id },
    })

    // Delete the page
    await prisma.page.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting page:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    )
  }
}

