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
    // Ensure bucket exists (common cause of 500s)
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error("Supabase listBuckets error:", bucketsError)
      return NextResponse.json({ error: "Storage not available" }, { status: 500 })
    }

    const hasBucket = Array.isArray(buckets) && buckets.some((b) => b.name === bucket)
    if (!hasBucket) {
      const { error: createBucketError } = await supabase.storage.createBucket(bucket, {
        public: true,
      })
      if (createBucketError) {
        console.error("Supabase createBucket error:", createBucketError)
        return NextResponse.json(
          {
            error: "Failed to create storage bucket",
            details: createBucketError.message,
          },
          { status: 500 }
        )
      }
    }

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

