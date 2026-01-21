import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const originalName = body?.originalName as string | undefined
    const mimeType = body?.mimeType as string | undefined

    if (!originalName || !mimeType) {
      return NextResponse.json({ error: "Missing originalName or mimeType" }, { status: 400 })
    }

    const timestamp = Date.now()
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedOriginalName}`

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads"
    const objectPath = `uploads/${filename}`

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(objectPath)

    if (error || !data) {
      console.error("Supabase createSignedUploadUrl error:", error)
      return NextResponse.json({ error: "Failed to create signed upload URL" }, { status: 500 })
    }

    const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(objectPath)

    return NextResponse.json({
      bucket,
      path: data.path,
      token: (data as any).token,
      signedUrl: (data as any).signedUrl,
      publicUrl: publicUrlResult.data?.publicUrl || "",
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(error?.message ?? error) },
      { status: 500 }
    )
  }
}

