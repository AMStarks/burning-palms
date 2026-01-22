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

export async function GET(req: Request) {
  const siteSettings = await getSiteSettings()
  const rawFavicon = (siteSettings.faviconUrl || "/icon").trim()
  const v = simpleHash(rawFavicon)
  const target = `${rawFavicon}${rawFavicon.includes("?") ? "&" : "?"}v=${v}`

  const base = new URL(req.url)
  const res = NextResponse.redirect(new URL(target, base), 307)
  res.headers.set("Cache-Control", "no-store")
  return res
}

