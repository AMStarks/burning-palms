"use client"

import { useEffect, useState } from "react"

export function GlobalColors() {
  const [colors, setColors] = useState<Record<string, string>>({})

  const fetchColors = () => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const colorSettings: Record<string, string> = {}
          for (const setting of data) {
            if (setting.category === "appearance" && setting.type === "color") {
              colorSettings[setting.key] = setting.value
            }
          }
          setColors(colorSettings)
        }
      })
      .catch((err) => {
        console.error("Error fetching color settings:", err)
      })
  }

  useEffect(() => {
    // Fetch on mount
    fetchColors()

    // Listen for settings update events
    const handleUpdate = () => {
      fetchColors()
    }
    window.addEventListener("typographySettingsUpdated", handleUpdate)
    window.addEventListener("colorSettingsUpdated", handleUpdate)

    return () => {
      window.removeEventListener("typographySettingsUpdated", handleUpdate)
      window.removeEventListener("colorSettingsUpdated", handleUpdate)
    }
  }, [])

  useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement
    
    // Core palette colors
    if (colors.color_background) {
      root.style.setProperty("--background", colors.color_background)
      root.style.setProperty("--color-background", colors.color_background)
    }
    if (colors.color_foreground) {
      root.style.setProperty("--foreground", colors.color_foreground)
      root.style.setProperty("--color-foreground", colors.color_foreground)
    }
    if (colors.color_accent_orange) {
      root.style.setProperty("--accent-orange", colors.color_accent_orange)
      root.style.setProperty("--color-accent-orange", colors.color_accent_orange)
    }
    if (colors.color_accent_yellow) {
      root.style.setProperty("--accent-yellow", colors.color_accent_yellow)
      root.style.setProperty("--color-accent-yellow", colors.color_accent_yellow)
    }
    if (colors.color_accent_brown) {
      root.style.setProperty("--accent-brown", colors.color_accent_brown)
      root.style.setProperty("--color-accent-brown", colors.color_accent_brown)
    }
    if (colors.color_accent_dark) {
      root.style.setProperty("--accent-dark", colors.color_accent_dark)
      root.style.setProperty("--color-accent-dark", colors.color_accent_dark)
    }
    
    // UI element colors
    if (colors.color_link) {
      root.style.setProperty("--color-link", colors.color_link)
    }
    if (colors.color_button_primary) {
      root.style.setProperty("--color-button-primary", colors.color_button_primary)
    }
    if (colors.color_button_secondary) {
      root.style.setProperty("--color-button-secondary", colors.color_button_secondary)
    }
    if (colors.color_header_background) {
      root.style.setProperty("--color-header-background", colors.color_header_background)
    }
    if (colors.color_footer_background) {
      root.style.setProperty("--color-footer-background", colors.color_footer_background)
    }
  }, [colors])

  return null
}
