"use client"

import { useEffect, useState } from "react"

type TypographySettings = {
  bodyFont?: string
  displayFont?: string
  baseSize?: string
  baseWeight?: string
  headingWeight?: string
  lineHeight?: string
  letterSpacing?: string
}

function fontNameToCSS(fontName: string): string {
  const fontMap: Record<string, string> = {
    "Inter": '"Inter", sans-serif',
    "Roboto": '"Roboto", sans-serif',
    "Open Sans": '"Open Sans", sans-serif',
    "Lato": '"Lato", sans-serif',
    "Montserrat": '"Montserrat", sans-serif',
    "Poppins": '"Poppins", sans-serif',
    "Source Sans Pro": '"Source Sans Pro", sans-serif',
    "Raleway": '"Raleway", sans-serif',
    "Nunito": '"Nunito", sans-serif',
    "Bebas Neue": '"Bebas Neue", cursive',
    "Oswald": '"Oswald", sans-serif',
    "Playfair Display": '"Playfair Display", serif',
    "Lobster": '"Lobster", cursive',
    "Barlow Condensed": '"Barlow Condensed", sans-serif',
    "Anton": '"Anton", sans-serif',
    "Righteous": '"Righteous", cursive',
  }
  return fontMap[fontName] || `"${fontName}", sans-serif`
}

function generateGoogleFontsLink(fontNames: string[]): string {
  const fontFamilies = fontNames
    .map((name) => name.replace(/\s+/g, "+"))
    .join("&family=")
  return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`
}

export function GlobalTypography() {
  const [settings, setSettings] = useState<TypographySettings>({
    bodyFont: "Inter",
    displayFont: "Bebas Neue",
    baseSize: "16",
    baseWeight: "400",
    headingWeight: "700",
    lineHeight: "1.5",
    letterSpacing: "0",
  })

  const fetchSettings = () => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const typographySettings: TypographySettings = {}
          for (const setting of data) {
            if (setting.category === "typography") {
              switch (setting.key) {
                case "typography_body_font":
                  typographySettings.bodyFont = setting.value
                  break
                case "typography_display_font":
                  typographySettings.displayFont = setting.value
                  break
                case "typography_base_size":
                  typographySettings.baseSize = setting.value
                  break
                case "typography_base_weight":
                  typographySettings.baseWeight = setting.value
                  break
                case "typography_heading_weight":
                  typographySettings.headingWeight = setting.value
                  break
                case "typography_line_height":
                  typographySettings.lineHeight = setting.value
                  break
                case "typography_letter_spacing":
                  typographySettings.letterSpacing = setting.value
                  break
              }
            }
          }
          setSettings({
            bodyFont: typographySettings.bodyFont || "Inter",
            displayFont: typographySettings.displayFont || "Bebas Neue",
            baseSize: typographySettings.baseSize || "16",
            baseWeight: typographySettings.baseWeight || "400",
            headingWeight: typographySettings.headingWeight || "700",
            lineHeight: typographySettings.lineHeight || "1.5",
            letterSpacing: typographySettings.letterSpacing || "0",
          })
        }
      })
      .catch((err) => {
        console.error("Error fetching typography settings:", err)
      })
  }

  useEffect(() => {
    // Fetch on mount
    fetchSettings()

    // Listen for settings update events
    const handleUpdate = () => {
      fetchSettings()
    }
    window.addEventListener("typographySettingsUpdated", handleUpdate)

    return () => {
      window.removeEventListener("typographySettingsUpdated", handleUpdate)
    }
  }, [])

  useEffect(() => {
    // Load Google Fonts
    const bodyFont = settings.bodyFont || "Inter"
    const displayFont = settings.displayFont || "Bebas Neue"
    const fontsToLoad = [bodyFont, displayFont].filter(Boolean)

    // Remove existing Google Fonts link if present
    const existingLink = document.getElementById("google-fonts-link")
    if (existingLink) {
      existingLink.remove()
    }

    // Add new Google Fonts link
    if (fontsToLoad.length > 0) {
      const link = document.createElement("link")
      link.id = "google-fonts-link"
      link.rel = "stylesheet"
      link.href = generateGoogleFontsLink(fontsToLoad)
      document.head.appendChild(link)
    }

    // Apply CSS variables
    const root = document.documentElement
    const bodyFontCSS = fontNameToCSS(bodyFont)
    const displayFontCSS = fontNameToCSS(displayFont)
    const baseSize = settings.baseSize || "16"
    const baseWeight = settings.baseWeight || "400"
    const headingWeight = settings.headingWeight || "700"
    const lineHeight = settings.lineHeight || "1.5"
    const letterSpacing = settings.letterSpacing || "0"

    root.style.setProperty("--typography-body-font", bodyFontCSS)
    root.style.setProperty("--typography-display-font", displayFontCSS)
    root.style.setProperty("--typography-base-size", `${baseSize}px`)
    root.style.setProperty("--typography-base-weight", baseWeight)
    root.style.setProperty("--typography-heading-weight", headingWeight)
    root.style.setProperty("--typography-line-height", lineHeight)
    root.style.setProperty("--typography-letter-spacing", `${letterSpacing}px`)

    return () => {
      // Cleanup: remove the link when component unmounts
      const linkToRemove = document.getElementById("google-fonts-link")
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [settings])

  return null
}
