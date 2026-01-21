import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get media record
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Delete from Supabase Storage if possible
    try {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads"
      const prefix = "/storage/v1/object/public/"
      const idx = media.url.indexOf(prefix)
      if (idx !== -1) {
        const pathWithBucket = media.url.slice(idx + prefix.length)
        // pathWithBucket = "<bucket>/<objectPath>"
        const slashIdx = pathWithBucket.indexOf("/")
        const objectPath = slashIdx !== -1 ? pathWithBucket.slice(slashIdx + 1) : ""
        if (objectPath) {
          const supabase = getSupabaseAdminClient()
          await supabase.storage.from(bucket).remove([objectPath])
        }
      }
    } catch (error) {
      console.error("Error deleting from Supabase Storage:", error)
      // Continue even if storage deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { alt } = body

    const media = await prisma.media.update({
      where: { id },
      data: {
        alt: alt || null,
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error updating media:", error)
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    )
  }
}
