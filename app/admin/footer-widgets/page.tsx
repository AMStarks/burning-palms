"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type FooterWidgetLink = {
  label: string
  url: string
}

type FooterWidget = {
  id?: string
  columnIndex: number
  title: string | null
  type: "text" | "links"
  content: string | null
  order: number
}

export default function FooterWidgetsPage() {
  const [widgets, setWidgets] = useState<FooterWidget[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [footerColumns, setFooterColumns] = useState(4)

  useEffect(() => {
    fetchFooterColumns()
    fetchWidgets()
  }, [])

  const fetchFooterColumns = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      const data = await res.json()
      if (Array.isArray(data)) {
        const columnsSetting = data.find((s: any) => s.key === "footer_columns")
        if (columnsSetting) {
          setFooterColumns(parseInt(columnsSetting.value) || 4)
        }
      }
    } catch (error) {
      console.error("Error fetching footer columns:", error)
    }
  }

  const fetchWidgets = async () => {
    try {
      const res = await fetch("/api/admin/footer-widgets")
      if (!res.ok) {
        setWidgets([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        console.log("Fetched widgets:", data)
        setWidgets(data)
      } else {
        console.error("Widgets data is not an array:", data)
        setWidgets([])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching widgets:", error)
      setWidgets([])
      setLoading(false)
    }
  }

  const getWidgetsForColumn = (columnIndex: number): FooterWidget => {
    const widget = widgets.find((w) => w.columnIndex === columnIndex)
    if (widget) return widget

    // Return default widget structure
    return {
      columnIndex,
      title: "",
      type: "links",
      content: JSON.stringify([]),
      order: 0,
    }
  }

  const updateWidget = (columnIndex: number, updates: Partial<FooterWidget>) => {
    const existingIndex = widgets.findIndex((w) => w.columnIndex === columnIndex)
    const widget = getWidgetsForColumn(columnIndex)
    const updated = { ...widget, ...updates }

    if (existingIndex >= 0) {
      const newWidgets = [...widgets]
      newWidgets[existingIndex] = updated
      setWidgets(newWidgets)
    } else {
      setWidgets([...widgets, updated])
    }
  }

  const updateLinks = (columnIndex: number, links: FooterWidgetLink[]) => {
    updateWidget(columnIndex, {
      content: JSON.stringify(links),
      type: "links",
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")

    try {
      // Ensure we have widgets for all columns
      const widgetsToSave: FooterWidget[] = []
      for (let i = 0; i < footerColumns; i++) {
        const widget = getWidgetsForColumn(i)
        widgetsToSave.push(widget)
      }

      const res = await fetch("/api/admin/footer-widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets: widgetsToSave }),
      })

      if (res.ok) {
        setMessage("Footer widgets saved successfully!")
        await fetchWidgets()
      } else {
        setMessage("Failed to save footer widgets")
      }
    } catch (error) {
      console.error("Error saving widgets:", error)
      setMessage("Error saving footer widgets")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading footer widgets...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Footer Widgets</h1>
          <p className="text-gray-600 mt-1">Manage footer column content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Widgets"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            message.includes("success")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: footerColumns }, (_, i) => (
          <ColumnEditor
            key={i}
            columnIndex={i}
            widget={getWidgetsForColumn(i)}
            onUpdate={(updates) => updateWidget(i, updates)}
            onUpdateLinks={(links) => updateLinks(i, links)}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> The number of columns is controlled in{" "}
          <Link href="/admin/settings" className="underline">
            Settings → Header & Footer Settings
          </Link>
          . Change the "Footer Columns" setting there, then return here to edit the content.
        </p>
      </div>
    </div>
  )
}

function ColumnEditor({
  columnIndex,
  widget,
  onUpdate,
  onUpdateLinks,
}: {
  columnIndex: number
  widget: FooterWidget
  onUpdate: (updates: Partial<FooterWidget>) => void
  onUpdateLinks: (links: FooterWidgetLink[]) => void
}) {
  const links: FooterWidgetLink[] = widget.type === "links" && widget.content
    ? (() => {
        try {
          return JSON.parse(widget.content)
        } catch (e) {
          console.error("Error parsing links:", e)
          return []
        }
      })()
    : []

  const addLink = () => {
    onUpdateLinks([...links, { label: "New Link", url: "#" }])
  }

  const updateLink = (index: number, updates: Partial<FooterWidgetLink>) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], ...updates }
    onUpdateLinks(newLinks)
  }

  const deleteLink = (index: number) => {
    onUpdateLinks(links.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Column {columnIndex + 1}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={widget.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            placeholder="Column heading"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={widget.type}
            onChange={(e) =>
              onUpdate({
                type: e.target.value as "text" | "links",
                content: e.target.value === "links" ? JSON.stringify([]) : "",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
          >
            <option value="links">Links List</option>
            <option value="text">Text Content</option>
          </select>
        </div>

        {widget.type === "links" ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Links
              </label>
              <button
                type="button"
                onClick={addLink}
                className="text-sm text-accent-orange hover:text-accent-orange/80"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(index, { label: e.target.value })}
                    placeholder="Label"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(index, { url: e.target.value })}
                    placeholder="URL"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => deleteLink(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No links yet. Click "Add Link" to get started.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              value={widget.content || ""}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              placeholder="Enter text content..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
