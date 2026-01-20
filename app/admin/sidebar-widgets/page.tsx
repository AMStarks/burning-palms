"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type SidebarWidgetLink = {
  label: string
  url: string
}

type SidebarWidget = {
  id?: string
  title: string | null
  type: "text" | "links"
  content: string | null
  order: number
}

export default function SidebarWidgetsPage() {
  const [widgets, setWidgets] = useState<SidebarWidget[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const res = await fetch("/api/admin/sidebar-widgets")
      if (!res.ok) {
        setWidgets([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setWidgets(data)
      } else {
        setWidgets([])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching widgets:", error)
      setWidgets([])
      setLoading(false)
    }
  }

  const updateWidget = (index: number, updates: Partial<SidebarWidget>) => {
    const newWidgets = [...widgets]
    newWidgets[index] = { ...newWidgets[index], ...updates }
    setWidgets(newWidgets)
  }

  const updateLinks = (index: number, links: SidebarWidgetLink[]) => {
    updateWidget(index, {
      content: JSON.stringify(links),
      type: "links",
    })
  }

  const addWidget = () => {
    setWidgets([
      ...widgets,
      {
        title: "",
        type: "links",
        content: JSON.stringify([]),
        order: widgets.length,
      },
    ])
  }

  const removeWidget = (index: number) => {
    setWidgets(widgets.filter((_, i) => i !== index))
  }

  const moveWidget = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === widgets.length - 1) return

    const newWidgets = [...widgets]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newWidgets[index], newWidgets[targetIndex]] = [
      newWidgets[targetIndex],
      newWidgets[index],
    ]
    setWidgets(newWidgets)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")

    try {
      const widgetsToSave = widgets.map((widget, index) => ({
        ...widget,
        order: index,
      }))

      const res = await fetch("/api/admin/sidebar-widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets: widgetsToSave }),
      })

      if (res.ok) {
        setMessage("Sidebar widgets saved successfully!")
        await fetchWidgets()
      } else {
        setMessage("Failed to save sidebar widgets")
      }
    } catch (error) {
      console.error("Error saving widgets:", error)
      setMessage("Error saving sidebar widgets")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading sidebar widgets...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sidebar Widgets</h1>
          <p className="text-gray-600 mt-1">Manage sidebar content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addWidget}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            + Add Widget
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Widgets"}
          </button>
        </div>
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

      <div className="space-y-4">
        {widgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No sidebar widgets yet.</p>
            <button
              onClick={addWidget}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
            >
              Add Your First Widget
            </button>
          </div>
        ) : (
          widgets.map((widget, index) => (
            <WidgetEditor
              key={index}
              index={index}
              widget={widget}
              onUpdate={(updates) => updateWidget(index, updates)}
              onUpdateLinks={(links) => updateLinks(index, links)}
              onRemove={() => removeWidget(index)}
              onMoveUp={() => moveWidget(index, "up")}
              onMoveDown={() => moveWidget(index, "down")}
              canMoveUp={index > 0}
              canMoveDown={index < widgets.length - 1}
            />
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Sidebar widgets will appear on pages when the
          sidebar is enabled in{" "}
          <Link href="/admin/settings" className="underline">
            Settings → Layout Settings
          </Link>
          . Set "Sidebar Position" to "Left Sidebar" or "Right Sidebar" to
          enable the sidebar.
        </p>
      </div>
    </div>
  )
}

function WidgetEditor({
  index,
  widget,
  onUpdate,
  onUpdateLinks,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  index: number
  widget: SidebarWidget
  onUpdate: (updates: Partial<SidebarWidget>) => void
  onUpdateLinks: (links: SidebarWidgetLink[]) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const links: SidebarWidgetLink[] =
    widget.type === "links" && widget.content
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

  const updateLink = (linkIndex: number, updates: Partial<SidebarWidgetLink>) => {
    const newLinks = [...links]
    newLinks[linkIndex] = { ...newLinks[linkIndex], ...updates }
    onUpdateLinks(newLinks)
  }

  const deleteLink = (linkIndex: number) => {
    onUpdateLinks(links.filter((_, i) => i !== linkIndex))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Widget {index + 1}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>

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
            placeholder="Widget heading (optional)"
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
              {links.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No links yet. Click "Add Link" to get started.
                </p>
              ) : (
                links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateLink(linkIndex, { label: e.target.value })
                      }
                      placeholder="Label"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        updateLink(linkIndex, { url: e.target.value })
                      }
                      placeholder="URL"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => deleteLink(linkIndex)}
                      className="px-2 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))
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
