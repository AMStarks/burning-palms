import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pages = await prisma.page.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth temporarily disabled
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // Get a user for authorId (temporary - should use session.user.id)
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })
    
    if (!adminUser) {
      return NextResponse.json({ error: "No admin user found" }, { status: 500 })
    }

    const body = await request.json()
    const { title, slug, content, excerpt, status, settings } = body

    const page = await prisma.page.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        content: content || "",
        excerpt,
        status: status || "draft",
        settings: settings ? JSON.stringify(settings) : "{}",
        authorId: adminUser.id,
      },
      include: { author: { select: { name: true, email: true } } },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error: any) {
    console.error("Error creating page:", error)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    )
  }
}

