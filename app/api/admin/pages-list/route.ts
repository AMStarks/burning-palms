import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"

// GET - Fetch all pages for page builder selection
export async function GET(request: NextRequest) {
  try {
    // For now, allow access without authentication check (temporary)
    // TODO: Add proper authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
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
