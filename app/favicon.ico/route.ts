import { NextResponse } from "next/server"
import { getSiteSettings } from "@/lib/settings"

export const dynamic = "force-dynamic"

function simpleHash(input: string) {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i)
  }
  return (h >>> 0).toString(16)
}

export async function GET() {
  const siteSettings = await getSiteSettings()
  const v = simpleHash(siteSettings.faviconUrl || "")
  const res = NextResponse.redirect(new URL(`/icon?v=${v}`, "http://localhost"), 307)
  res.headers.set("Cache-Control", "no-store")
  return res
}

