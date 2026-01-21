"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { COLOR_PRESETS, applyColorPreset } from "@/lib/color-presets"
import { compressImageFile } from "@/lib/image-compress"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

type Setting = {
  key: string
  value: string
  category?: string
  type?: string
}

// Initialize default settings outside component to prevent recreation on every render
const defaultSettings: Setting[] = [
    // General
    { key: "site_title", value: "Burning Palms", category: "general", type: "string" },
    { key: "site_description", value: "Retro 70s inspired Australian surf and street wear. Authentic style from down under.", category: "general", type: "string" },
    { key: "site_tagline", value: "Retro 70s Australian Surf & Street Wear", category: "general", type: "string" },

    // SEO / Sharing (link previews in SMS/social)
    { key: "share_title", value: "", category: "seo", type: "string" },
    { key: "share_description", value: "", category: "seo", type: "string" },
    { key: "share_image_url", value: "", category: "seo", type: "image" },
    
    // Colors - Core Palette
    { key: "color_background", value: "#faf8f3", category: "appearance", type: "color" },
    { key: "color_foreground", value: "#8b4513", category: "appearance", type: "color" },
    { key: "color_accent_orange", value: "#ff6b35", category: "appearance", type: "color" },
    { key: "color_accent_yellow", value: "#ffb347", category: "appearance", type: "color" },
    { key: "color_accent_brown", value: "#a0522d", category: "appearance", type: "color" },
    { key: "color_accent_dark", value: "#5d4037", category: "appearance", type: "color" },
    // Colors - UI Elements
    { key: "color_link", value: "#ff6b35", category: "appearance", type: "color" },
    { key: "color_button_primary", value: "#ff6b35", category: "appearance", type: "color" },
    { key: "color_button_secondary", value: "#5d4037", category: "appearance", type: "color" },
    { key: "color_header_background", value: "", category: "appearance", type: "color" },
    { key: "color_footer_background", value: "", category: "appearance", type: "color" },
    
    // Images
    { key: "logo_url", value: "/logo.png", category: "appearance", type: "image" },
    { key: "hero_background_image", value: "", category: "appearance", type: "image" },
    { key: "favicon_url", value: "/favicon.ico", category: "appearance", type: "image" },
    
    // Typography
    { key: "typography_body_font", value: "Inter", category: "typography", type: "select" },
    { key: "typography_display_font", value: "Bebas Neue", category: "typography", type: "select" },
    { key: "typography_base_size", value: "16", category: "typography", type: "number" },
    { key: "typography_base_weight", value: "400", category: "typography", type: "select" },
    { key: "typography_heading_weight", value: "700", category: "typography", type: "select" },
    { key: "typography_line_height", value: "1.5", category: "typography", type: "number" },
    { key: "typography_letter_spacing", value: "0", category: "typography", type: "number" },
    
    // Product Display
    { key: "products_per_page", value: "12", category: "shop", type: "number" },
    { key: "product_grid_columns_desktop", value: "3", category: "shop", type: "select" },
    { key: "product_grid_columns_tablet", value: "2", category: "shop", type: "select" },
    { key: "product_grid_columns_mobile", value: "1", category: "shop", type: "select" },
    { key: "product_image_aspect_ratio", value: "square", category: "shop", type: "select" },
    { key: "product_card_hover_effect", value: "lift", category: "shop", type: "select" },
    { key: "product_card_border_style", value: "none", category: "shop", type: "select" },
    { key: "product_card_shadow", value: "medium", category: "shop", type: "select" },
    
    // Layout
    { key: "container_width", value: "7xl", category: "layout", type: "select" },
    { key: "content_width", value: "7xl", category: "layout", type: "select" },
    { key: "sidebar_position", value: "none", category: "layout", type: "select" },
    { key: "sidebar_width", value: "normal", category: "layout", type: "select" },
    
    // Header/Footer
    { key: "header_sticky", value: "true", category: "header_footer", type: "select" },
    { key: "header_layout", value: "standard", category: "header_footer", type: "select" },
    { key: "header_height", value: "normal", category: "header_footer", type: "select" },
    { key: "footer_columns", value: "4", category: "header_footer", type: "select" },
    { key: "footer_copyright_text", value: "© 2025 Burning Palms. All rights reserved.", category: "header_footer", type: "string" },
    
    // Custom CSS
    { key: "custom_css", value: "", category: "advanced", type: "textarea" },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let isMounted = true
    
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        
        if (Array.isArray(data)) {
          // Merge with defaults, prioritizing database values but preserving category/type from defaults
          const merged = defaultSettings.map((defaultSetting) => {
            const dbSetting = data.find((s: Setting) => s.key === defaultSetting.key)
            if (dbSetting) {
              // Keep database value but ALWAYS use category and type from defaults
              return {
                ...dbSetting,
                category: defaultSetting.category,
                type: defaultSetting.type,
              }
            }
            return defaultSetting
          })
          setSettings(merged)
        } else {
          console.error("Settings data is not an array:", data)
          setSettings(defaultSettings)
        }
        setLoading(false)
      })
      .catch((error) => {
        if (!isMounted) return
        console.error("Error fetching settings:", error)
        setSettings(defaultSettings)
        setLoading(false)
      })
    
    return () => {
      isMounted = false
    }
  }, [])

  const getSetting = (key: string): string => {
    return settings.find((s) => s.key === key)?.value || ""
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => {
      const existing = prev.find((s) => s.key === key)
      if (existing) {
        return prev.map((s) => (s.key === key ? { ...s, value } : s))
      } else {
        const defaultSetting = defaultSettings.find((s) => s.key === key)
        return [
          ...prev,
          {
            key,
            value,
            category: defaultSetting?.category || "general",
            type: defaultSetting?.type || "string",
          },
        ]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      setMessage("Settings saved successfully!")
      setTimeout(() => setMessage(""), 5000)
      
      // Dispatch events to notify components to refresh
      window.dispatchEvent(new CustomEvent("typographySettingsUpdated"))
      window.dispatchEvent(new CustomEvent("colorSettingsUpdated"))
      window.dispatchEvent(new CustomEvent("settingsUpdated"))
    } catch (error) {
      setMessage("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (key: string, file: File) => {
    setSaving(true)
    try {
      // Preserve transparency for logo/favicon to avoid JPEG conversion adding a background.
      const compressOpts =
        key === "favicon_url" || key === "logo_url"
          ? { maxWidth: 512, maxHeight: 512, maxBytes: 750_000, outputType: "image/png" as const }
          : undefined

      const compressed = await compressImageFile(file, compressOpts).catch(() => file)

      const signedRes = await fetch("/api/admin/media/signed-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: compressed.name,
          mimeType: compressed.type,
        }),
      })
      const signed = await signedRes.json().catch(() => null)
      if (!signedRes.ok || !signed?.path || !signed?.token || !signed?.publicUrl) {
        throw new Error(signed?.error || "Failed to prepare upload")
      }

      const supabase = getSupabaseBrowserClient()
      const uploadResult = await supabase.storage
        .from(signed.bucket || "uploads")
        .uploadToSignedUrl(signed.path, signed.token, compressed)

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message || "Upload failed")
      }

      const recordRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: signed.publicUrl,
          originalName: compressed.name,
          mimeType: compressed.type,
          size: compressed.size,
          alt: key,
        }),
      })
      const data = await recordRes.json().catch(() => null)
      if (!recordRes.ok) {
        throw new Error(data?.error || "Failed to save media record")
      }

      handleChange(key, data.url)
      setMessage("Image uploaded successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setMessage(`Failed to upload image: ${error.message || "Unknown error"}`)
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || "general"
    if (!acc[category]) acc[category] = []
    acc[category].push(setting)
    return acc
  }, {} as Record<string, Setting[]>)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-accent-dark mb-2">
          Website Settings
        </h1>
        <p className="text-gray-600">Manage your website appearance, content, and configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {message && (
          <div
            className={`px-4 py-3 rounded ${
              message.includes("success")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* General Settings */}
        {groupedSettings.general && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              General Settings
            </h2>
            <div className="space-y-4">
              {groupedSettings.general.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.key
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </label>
                  <input
                    type="text"
                    value={getSetting(setting.key)}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO / Sharing Settings */}
        {groupedSettings.seo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-2">
              SEO & Sharing
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Controls the title/description/image shown when your link is shared via SMS and social platforms.
            </p>
            <div className="space-y-4">
              {groupedSettings.seo
                .filter((s) => s.type !== "image")
                .map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {setting.key
                        .replace("share_", "")
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </label>
                    <input
                      type="text"
                      value={getSetting(setting.key)}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                      placeholder={setting.key === "share_title" ? "Burning Palms" : "Retro 70s Australian surf & street wear."}
                    />
                  </div>
                ))}

              {groupedSettings.seo
                .filter((s) => s.type === "image")
                .map((setting) => {
                  const imageUrl = getSetting(setting.key)
                  return (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Share Image (Open Graph)
                      </label>
                      <div className="space-y-2">
                        {imageUrl && (
                          <div className="relative w-full max-w-md aspect-[1.91/1] border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src={imageUrl}
                              alt="Share preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                            placeholder="Leave blank to use the default generated preview image"
                          />
                          <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleImageUpload(setting.key, file)
                                }
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          Recommended: 1200×630 PNG/JPG for best previews.
                        </p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Appearance Settings - Colors */}
        {groupedSettings.appearance && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Colors & Appearance
            </h2>

            {/* Color Presets */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Presets
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      const presetColors = applyColorPreset(preset)
                      const updatedSettings = settings.map((s) => {
                        if (presetColors[s.key] !== undefined) {
                          return { ...s, value: presetColors[s.key] }
                        }
                        return s
                      })
                      // Add any new colors from preset
                      Object.entries(presetColors).forEach(([key, value]) => {
                        if (!updatedSettings.find((s) => s.key === key)) {
                          const defaultSetting = defaultSettings.find((ds) => ds.key === key)
                          updatedSettings.push({
                            key,
                            value,
                            category: defaultSetting?.category || "appearance",
                            type: defaultSetting?.type || "color",
                          })
                        }
                      })
                      setSettings(updatedSettings)
                    }}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-accent-orange transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1 flex-1">
                        {Object.values(preset.colors)
                          .slice(0, 6)
                          .filter((c) => c)
                          .map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Palette Colors */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Core Palette</h3>
              <div className="space-y-4">
                {groupedSettings.appearance
                  .filter((s) => s.type === "color" && !s.key.includes("link") && !s.key.includes("button") && !s.key.includes("header") && !s.key.includes("footer"))
                  .map((setting) => (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {setting.key
                          .replace("color_", "")
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={getSetting(setting.key) || "#ffffff"}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={getSetting(setting.key)}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent font-mono text-sm"
                          placeholder="#ffffff"
                        />
                        <div
                          className="w-12 h-10 rounded border border-gray-300"
                          style={{ backgroundColor: getSetting(setting.key) || "#ffffff" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* UI Element Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">UI Elements</h3>
              <div className="space-y-4">
                {groupedSettings.appearance
                  .filter((s) => s.type === "color" && (s.key.includes("link") || s.key.includes("button") || s.key.includes("header") || s.key.includes("footer")))
                  .map((setting) => (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {setting.key
                          .replace("color_", "")
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                        {setting.key.includes("header") || setting.key.includes("footer") ? (
                          <span className="text-xs text-gray-500 ml-2">(optional - leave empty for transparent)</span>
                        ) : null}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={getSetting(setting.key) || "#ffffff"}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                          disabled={setting.key.includes("header") || setting.key.includes("footer") ? false : false}
                        />
                        <input
                          type="text"
                          value={getSetting(setting.key)}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent font-mono text-sm"
                          placeholder={setting.key.includes("header") || setting.key.includes("footer") ? "Leave empty for transparent" : "#ffffff"}
                        />
                        {getSetting(setting.key) && (
                          <div
                            className="w-12 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: getSetting(setting.key) }}
                          />
                        )}
            </div>
          </div>
        ))}
              </div>
            </div>
          </div>
        )}

        {/* Typography Settings */}
        {groupedSettings.typography && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Typography
            </h2>
            <div className="space-y-4">
              {/* Body Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Font
                </label>
                <select
                  value={getSetting("typography_body_font")}
                  onChange={(e) => handleChange("typography_body_font", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Nunito">Nunito</option>
                </select>
              </div>

              {/* Display Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Font (Headings)
                </label>
                <select
                  value={getSetting("typography_display_font")}
                  onChange={(e) => handleChange("typography_display_font", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Lobster">Lobster</option>
                  <option value="Barlow Condensed">Barlow Condensed</option>
                  <option value="Anton">Anton</option>
                  <option value="Righteous">Righteous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Base Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Font Size (px)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="24"
                    value={getSetting("typography_base_size")}
                    onChange={(e) => handleChange("typography_base_size", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  />
                </div>

                {/* Base Font Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font Weight
                  </label>
                  <select
                    value={getSetting("typography_base_weight")}
                    onChange={(e) => handleChange("typography_base_weight", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Heading Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font Weight
                  </label>
                  <select
                    value={getSetting("typography_heading_weight")}
                    onChange={(e) => handleChange("typography_heading_weight", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  >
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra-bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Height
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="2"
                    step="0.1"
                    value={getSetting("typography_line_height")}
                    onChange={(e) => handleChange("typography_line_height", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  />
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter Spacing (px)
                </label>
                <input
                  type="number"
                  min="-2"
                  max="5"
                  step="0.1"
                  value={getSetting("typography_letter_spacing")}
                  onChange={(e) => handleChange("typography_letter_spacing", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Negative values tighten spacing, positive values increase it
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Display Settings */}
        {groupedSettings.shop && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Product Display Settings
            </h2>
            <div className="space-y-6">
              {/* Products Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products Per Page
                </label>
                <input
                  type="number"
                  min="4"
                  max="48"
                  step="4"
                  value={getSetting("products_per_page")}
                  onChange={(e) => handleChange("products_per_page", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of products to show per page (4, 8, 12, 16, 24, 36, or 48)
                </p>
              </div>

              {/* Grid Columns */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Grid Columns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desktop
                    </label>
                    <select
                      value={getSetting("product_grid_columns_desktop")}
                      onChange={(e) => handleChange("product_grid_columns_desktop", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                      <option value="4">4 Columns</option>
                      <option value="5">5 Columns</option>
                      <option value="6">6 Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tablet
                    </label>
                    <select
                      value={getSetting("product_grid_columns_tablet")}
                      onChange={(e) => handleChange("product_grid_columns_tablet", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="1">1 Column</option>
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                      <option value="4">4 Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile
                    </label>
                    <select
                      value={getSetting("product_grid_columns_mobile")}
                      onChange={(e) => handleChange("product_grid_columns_mobile", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="1">1 Column</option>
                      <option value="2">2 Columns</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Image Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image Aspect Ratio
                </label>
                <select
                  value={getSetting("product_image_aspect_ratio")}
                  onChange={(e) => handleChange("product_image_aspect_ratio", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="square">Square (1:1)</option>
                  <option value="portrait">Portrait (3:4)</option>
                  <option value="landscape">Landscape (4:3)</option>
                  <option value="tall">Tall (2:3)</option>
                  <option value="wide">Wide (3:2)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Aspect ratio for product images in the grid
                </p>
              </div>

              {/* Product Card Styling */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Product Card Styling</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hover Effect
                    </label>
                    <select
                      value={getSetting("product_card_hover_effect")}
                      onChange={(e) => handleChange("product_card_hover_effect", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="lift">Lift Up</option>
                      <option value="scale">Scale</option>
                      <option value="fade">Fade</option>
                      <option value="glow">Glow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Style
                    </label>
                    <select
                      value={getSetting("product_card_border_style")}
                      onChange={(e) => handleChange("product_card_border_style", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="thin">Thin Border</option>
                      <option value="medium">Medium Border</option>
                      <option value="thick">Thick Border</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shadow
                    </label>
                    <select
                      value={getSetting("product_card_shadow")}
                      onChange={(e) => handleChange("product_card_shadow", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Settings */}
        {groupedSettings.layout && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Layout Settings
            </h2>
            <div className="space-y-6">
              {/* Container Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container Width
                </label>
                <select
                  value={getSetting("container_width")}
                  onChange={(e) => handleChange("container_width", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="4xl">Narrow (896px)</option>
                  <option value="5xl">Medium (1024px)</option>
                  <option value="6xl">Wide (1152px)</option>
                  <option value="7xl">Extra Wide (1280px) - Default</option>
                  <option value="full">Full Width</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Maximum width for main content containers
                </p>
              </div>

              {/* Content Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Width
                </label>
                <select
                  value={getSetting("content_width")}
                  onChange={(e) => handleChange("content_width", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="3xl">Narrow (768px)</option>
                  <option value="4xl">Medium (896px)</option>
                  <option value="5xl">Wide (1024px)</option>
                  <option value="6xl">Extra Wide (1152px)</option>
                  <option value="7xl">Full Container (1280px) - Default</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Width for text content areas (blog posts, articles, etc.)
                </p>
              </div>

              {/* Sidebar Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sidebar Position
                </label>
                <select
                  value={getSetting("sidebar_position")}
                  onChange={(e) => handleChange("sidebar_position", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                >
                  <option value="none">No Sidebar - Default</option>
                  <option value="left">Left Sidebar</option>
                  <option value="right">Right Sidebar</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Sidebar will be available when implemented in page templates
                </p>
              </div>

              {/* Sidebar Width (only show if sidebar is enabled) */}
              {getSetting("sidebar_position") !== "none" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sidebar Width
                  </label>
                  <select
                    value={getSetting("sidebar_width")}
                    onChange={(e) => handleChange("sidebar_width", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  >
                    <option value="narrow">Narrow (256px)</option>
                    <option value="normal">Normal (320px) - Default</option>
                    <option value="wide">Wide (384px)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header & Footer Settings */}
        {groupedSettings.header_footer && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Header & Footer Settings
            </h2>
            <div className="space-y-6">
              {/* Header Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Header Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sticky Header
                    </label>
                    <select
                      value={getSetting("header_sticky")}
                      onChange={(e) => handleChange("header_sticky", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Keep header visible when scrolling
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Layout
                    </label>
                    <select
                      value={getSetting("header_layout")}
                      onChange={(e) => handleChange("header_layout", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="standard">Standard (Logo Left, Menu Right)</option>
                      <option value="centered">Centered (Logo Center, Menu Below)</option>
                      <option value="split">Split (Logo Left, Menu & Actions Right)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Layout style for header navigation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Height
                    </label>
                    <select
                      value={getSetting("header_height")}
                      onChange={(e) => handleChange("header_height", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="compact">Compact (64px)</option>
                      <option value="normal">Normal (80px) - Default</option>
                      <option value="tall">Tall (96px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Footer Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Columns
                    </label>
                    <select
                      value={getSetting("footer_columns")}
                      onChange={(e) => handleChange("footer_columns", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    >
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                      <option value="4">4 Columns - Default</option>
                      <option value="5">5 Columns</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Number of widget areas in footer
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={getSetting("footer_copyright_text")}
                      onChange={(e) => handleChange("footer_copyright_text", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                      placeholder="© 2025 Your Company. All rights reserved."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Text displayed in footer copyright area
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings - Images */}
        {groupedSettings.appearance && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Images & Media
            </h2>
            <div className="space-y-6">
              {groupedSettings.appearance
                .filter((s) => s.type === "image")
                .map((setting) => {
                  const imageUrl = getSetting(setting.key)
                  return (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {setting.key
                          .replace(/_url|_image/, "")
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </label>
                      <div className="space-y-2">
                        {imageUrl && (
                          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src={imageUrl}
                              alt={setting.key}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                            placeholder="/path/to/image.png"
                          />
                          <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleImageUpload(setting.key, file)
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {groupedSettings.advanced && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-display text-2xl text-accent-dark mb-4">
              Advanced Settings
            </h2>
            <div className="space-y-6">
              {groupedSettings.advanced.map((setting) => {
                if (setting.type === "textarea") {
                  return (
                    <div key={setting.key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {setting.key
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </label>
                        <span className="text-xs text-gray-500">Add custom CSS to override default styles</span>
                      </div>
                      <textarea
                        value={getSetting(setting.key)}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent font-mono text-sm"
                        placeholder="/* Add your custom CSS here */&#10;&#10;.my-custom-class {&#10;  color: #ff6b35;&#10;}"
                        spellCheck={false}
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Custom CSS will be injected into the page. Use this for advanced styling that isn't available in the settings above.
                      </p>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
