"use client"

import { useState, useEffect } from "react"

export function CustomCSS() {
  const [css, setCss] = useState("")

  useEffect(() => {
    // Fetch custom CSS from settings
    const fetchCustomCSS = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const cssSetting = data.find((s: any) => s.key === "custom_css")
            if (cssSetting && cssSetting.value) {
              setCss(cssSetting.value)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching custom CSS:", error)
      }
    }

    fetchCustomCSS()

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      fetchCustomCSS()
    }

    window.addEventListener("settingsUpdated", handleSettingsUpdate)

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate)
    }
  }, [])

  // Inject CSS into the page
  useEffect(() => {
    if (!css) return

    // Remove existing custom CSS style tag if it exists
    const existingStyle = document.getElementById("custom-css-injected")
    if (existingStyle) {
      existingStyle.remove()
    }

    // Create and inject new style tag
    const style = document.createElement("style")
    style.id = "custom-css-injected"
    style.textContent = css
    document.head.appendChild(style)

    return () => {
      const styleToRemove = document.getElementById("custom-css-injected")
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [css])

  return null // This component doesn't render anything visible
}
