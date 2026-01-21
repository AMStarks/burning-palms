"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function Turnstile({
  siteKey,
  onToken,
  theme = "light",
}: {
  siteKey: string
  onToken: (token: string) => void
  theme?: "light" | "dark" | "auto"
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.turnstile) {
      setReady(true)
      return
    }

    const existing = document.querySelector('script[data-turnstile="1"]') as HTMLScriptElement | null
    if (existing) {
      const onLoad = () => setReady(true)
      existing.addEventListener("load", onLoad)
      return () => existing.removeEventListener("load", onLoad)
    }

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.dataset.turnstile = "1"
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!ref.current) return
    if (!window.turnstile) return
    if (widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => onToken(token),
      "error-callback": () => onToken(""),
      "expired-callback": () => onToken(""),
    })

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null
    }
  }, [ready, siteKey, theme, onToken])

  return <div ref={ref} />
}

