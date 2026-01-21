import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// Auth temporarily disabled
const DEFAULT_USER_ID = "admin-user-id" // In production, get from session

export async function GET(request: NextRequest) {
  try {
    // Get all media files
    const media = await prisma.media.findMany({
      include: {
        uploadedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const alt = formData.get("alt") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get admin user (in production, get from session)
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })

    if (!adminUser) {
      return NextResponse.json({ error: "No admin user found" }, { status: 500 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedOriginalName}`
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads"
    const objectPath = `uploads/${filename}`

    const supabase = getSupabaseAdminClient()
    const uploadResult = await supabase.storage
      .from(bucket)
      .upload(objectPath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      })

    if (uploadResult.error) {
      console.error("Supabase upload error:", uploadResult.error)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(objectPath)
    const publicUrl = publicUrlResult.data?.publicUrl

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: publicUrl || "",
        alt: alt || null,
        uploadedById: adminUser.id,
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    )
  }
}
