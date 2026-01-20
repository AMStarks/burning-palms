"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PagePreview } from "./components/PagePreview"

type PageSection = {
  id: string
  pageId: string | null
  type: string
  order: number
  settings: string | null
  content: string | null
  visible: boolean
}

const SECTION_TYPES = [
  { value: "hero", label: "Hero Section", icon: "🎯" },
  { value: "products", label: "Products Grid", icon: "🛍️" },
  { value: "about", label: "About/Text", icon: "📝" },
  { value: "image", label: "Image Section", icon: "🖼️" },
  { value: "text", label: "Text Block", icon: "📄" },
]

type Page = {
  id: string
  title: string
  slug: string
  status: string
}

export default function PageBuilderPage() {
  const [sections, setSections] = useState<PageSection[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null) // null = homepage
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showNewPageDialog, setShowNewPageDialog] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState("")
  const [newPageSlug, setNewPageSlug] = useState("")
  const [editingPageTitle, setEditingPageTitle] = useState(false)
  const [pageTitleValue, setPageTitleValue] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {
    // Fetch sections when selectedPageId changes
    const pageId = selectedPageId || null
    fetchSections(pageId)
  }, [selectedPageId])

  useEffect(() => {
    // Update page title value when page selection or pages list changes
    if (selectedPageId) {
      const page = pages.find((p) => p.id === selectedPageId)
      setPageTitleValue(page?.title || "")
      setEditingPageTitle(false)
    } else {
      setPageTitleValue("")
      setEditingPageTitle(false)
    }
  }, [selectedPageId, pages.length])

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages-list")
      if (res.ok) {
        const data = await res.json()
        setPages(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching pages:", error)
    }
  }

  const fetchSections = async (pageIdOverride?: string | null) => {
    setLoading(true)
    try {
      // Use override if provided, otherwise use current selectedPageId
      const pageId = pageIdOverride !== undefined ? (pageIdOverride || "") : (selectedPageId || "")
      const url = `/api/admin/page-sections?pageId=${pageId}`
      console.log("Fetching sections from:", url, "pageIdOverride:", pageIdOverride, "selectedPageId:", selectedPageId)
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        console.log("Fetched sections data:", data, "Array length:", Array.isArray(data) ? data.length : "not an array")
        setSections(Array.isArray(data) ? data : [])
        setHasUnsavedChanges(false)
      } else {
        console.error("Failed to fetch sections:", res.statusText)
        const errorData = await res.json().catch(() => ({}))
        console.error("Error details:", errorData)
        setSections([])
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id)
      const newIndex = sections.findIndex((s) => s.id === over.id)

      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }))
      setSections(newSections)

      // Save new order
      await saveSections(newSections)
    }
  }

  const saveSections = async (sectionsToSave: PageSection[] = sections) => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/page-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sectionsToSave.map((s, i) => ({ ...s, order: i })),
        }),
      })

      if (res.ok) {
        setMessage("Sections saved successfully!")
        setHasUnsavedChanges(false)
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save sections")
      }
    } catch (error) {
      console.error("Error saving sections:", error)
      setMessage("Error saving sections")
    } finally {
      setSaving(false)
    }
  }

  const addSection = async (type: string) => {
    try {
      const res = await fetch("/api/admin/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPageId || null,
          type,
          settings: JSON.stringify({ padding: "normal", spacing: "normal" }),
          content: JSON.stringify({}),
        }),
      })

      if (res.ok) {
        await fetchSections()
      }
    } catch (error) {
      console.error("Error adding section:", error)
    }
  }

  const createPage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      setMessage("Please enter both title and slug")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageSlug,
          content: "",
          status: "draft",
        }),
      })

      if (res.ok) {
        const newPage = await res.json()
        await fetchPages()
        setSelectedPageId(newPage.id)
        setShowNewPageDialog(false)
        setNewPageTitle("")
        setNewPageSlug("")
        setMessage("Page created successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to create page")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error creating page:", error)
      setMessage("Error creating page")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    try {
      const res = await fetch(`/api/admin/page-sections/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await fetchSections()
        if (selectedSection?.id === id) {
          setSelectedSection(null)
        }
      }
    } catch (error) {
      console.error("Error deleting section:", error)
    }
  }

  const deletePage = async () => {
    // Prevent deletion of homepage
    if (!selectedPageId) {
      setMessage("Homepage cannot be deleted")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Get page title for confirmation
    const page = pages.find((p) => p.id === selectedPageId)
    const pageTitle = page?.title || "this page"
    
    // Additional check: prevent deletion if this is the homepage (slug === 'home')
    if (page?.slug === "home") {
      setMessage("Homepage cannot be deleted")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Confirmation prompt
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/pages/${selectedPageId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setMessage(`Page "${pageTitle}" deleted successfully!`)
        setTimeout(() => setMessage(""), 3000)
        
        // Refresh pages list first
        await fetchPages()
        
        // Switch back to homepage and explicitly fetch homepage sections
        setSelectedPageId(null)
        // Explicitly fetch homepage sections with null pageId
        await fetchSections(null)
      } else {
        const errorData = await res.json()
        setMessage(`Failed to delete page: ${errorData.error || res.statusText}`)
        setTimeout(() => setMessage(""), 5000)
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      setMessage("Error deleting page")
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const updatePageTitle = async (newTitle: string) => {
    if (!selectedPageId || !newTitle.trim()) return

    const page = pages.find((p) => p.id === selectedPageId)
    if (!page) return

    try {
      const res = await fetch(`/api/admin/pages/${selectedPageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: page.slug,
          content: "",
          status: page.status,
        }),
      })

      if (res.ok) {
        await fetchPages()
        setEditingPageTitle(false)
        setMessage("Page title updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        const errorData = await res.json()
        setMessage(`Failed to update page title: ${errorData.error || res.statusText}`)
        setTimeout(() => setMessage(""), 5000)
      }
    } catch (error) {
      console.error("Error updating page title:", error)
      setMessage("Error updating page title")
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    const section = sections.find((s) => s.id === id)
    if (!section) return

    const updated = { ...section, ...updates }

    // Update local state only; user must click "Save Changes" to persist.
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)))
    if (selectedSection?.id === id) {
      setSelectedSection(updated)
    }
    setHasUnsavedChanges(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading page builder...</div>
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 flex" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Left Sidebar - Section List */}
      <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Builder</h1>
          <p className="text-sm text-gray-600">Drag sections to reorder</p>
        </div>

        <div className="p-4 border-b border-gray-200">
          {/* Page Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Page
            </label>
            <div className="flex gap-2">
              <select
                value={selectedPageId || "homepage"}
                onChange={(e) => setSelectedPageId(e.target.value === "homepage" ? null : e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="homepage">Homepage</option>
                {pages.filter((page) => page.slug !== "home").map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewPageDialog(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                title="Create New Page"
              >
                +
              </button>
            </div>
          </div>

          {/* Page Title Editor - Only show for non-homepage pages */}
          {selectedPageId && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              {editingPageTitle ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageTitleValue}
                    onChange={(e) => setPageTitleValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updatePageTitle(pageTitleValue)
                      } else if (e.key === "Escape") {
                        setEditingPageTitle(false)
                        const page = pages.find((p) => p.id === selectedPageId)
                        setPageTitleValue(page?.title || "")
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => updatePageTitle(pageTitleValue)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setEditingPageTitle(false)
                      const page = pages.find((p) => p.id === selectedPageId)
                      setPageTitleValue(page?.title || "")
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-400 flex items-center justify-between transition-colors"
                  onClick={() => setEditingPageTitle(true)}
                  title="Click to edit"
                >
                  <span className="flex-1 text-gray-900">{pageTitleValue || pages.find((p) => p.id === selectedPageId)?.title || ""}</span>
                  <span className="text-gray-400 ml-2 text-xs">✎</span>
                </div>
              )}
            </div>
          )}
        </div>

        {message && (
          <div
            className={`mx-4 mt-4 px-3 py-2 rounded text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="p-4">
          <button
            onClick={() => saveSections()}
            disabled={saving}
            className="w-full px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 disabled:opacity-50 mb-4"
          >
            {saving ? "Saving..." : hasUnsavedChanges ? "Save Changes *" : "Save Changes"}
          </button>

          {/* Delete Page Button - Only show for non-homepage pages */}
          {selectedPageId && pages.find((p) => p.id === selectedPageId)?.slug !== "home" && (
            <button
              onClick={deletePage}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 mb-4"
            >
              Delete Page
            </button>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addSection(type.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                >
                  <span>{type.icon}</span>
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No sections yet. Add one above.
                  </div>
                ) : (
                  sections.map((section) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      isSelected={selectedSection?.id === section.id}
                      onSelect={() => setSelectedSection(section)}
                      onDelete={() => deleteSection(section.id)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Right Side - Live Page Preview with Settings Drawer */}
      <div className="flex-1 relative overflow-hidden bg-gray-100 flex">
        {/* Live Page Preview - Always visible, scaled to fit */}
        <div className="flex-1 relative overflow-auto bg-gray-200 p-4">
          <div className="flex items-start justify-center min-h-full py-4">
            <div
              className="bg-white shadow-2xl origin-top"
              style={{
                transform: "scale(0.75)",
                transformOrigin: "top center",
                width: "133.33%", // 100 / 0.75 = 133.33% to maintain original width after scaling
              }}
            >
              <PagePreview
                sections={sections}
                selectedSectionId={selectedSection?.id || null}
                onSectionClick={(sectionId) => {
                  const section = sections.find((s) => s.id === sectionId)
                  if (section) {
                    setSelectedSection(section)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Settings Drawer - Fixed width, always present space */}
        <div className={`w-[360px] bg-gray-100 border-l border-gray-300 transition-all duration-300 ${selectedSection ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {selectedSection && (
            <div className="w-full h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-40 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Section Settings</h2>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <SectionSettingsPanel
                  section={selectedSection}
                  onUpdate={(updates) => {
                    updateSection(selectedSection.id, updates)
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Page Dialog */}
      {showNewPageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., About Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Slug
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., about-us"
                />
                <p className="mt-1 text-xs text-gray-500">Used in the URL: /page/[slug]</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewPageDialog(false)
                  setNewPageTitle("")
                  setNewPageSlug("")
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createPage}
                className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: PageSection
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const sectionType = SECTION_TYPES.find((t) => t.value === section.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg cursor-move ${
        isSelected
          ? "border-accent-orange bg-accent-orange/5"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 flex-1"
          onClick={onSelect}
        >
          <span className="text-lg">{sectionType?.icon || "📦"}</span>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900">
              {sectionType?.label || section.type}
            </div>
            <div className="text-xs text-gray-500">
              Order: {section.order + 1}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-red-600 hover:text-red-700 text-sm px-2"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function SectionSettingsPanel({
  section,
  onUpdate,
}: {
  section: PageSection
  onUpdate: (updates: Partial<PageSection>) => void
}) {
  const settings = section.settings
    ? JSON.parse(section.settings)
    : { padding: "normal", spacing: "normal", backgroundColor: "", textColor: "" }

  const content = section.content ? JSON.parse(section.content) : {}

  const normalizeHexColor = (value: any, fallback: string) => {
    const v = typeof value === "string" ? value.trim() : ""
    return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback
  }

  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    onUpdate({ settings: JSON.stringify(newSettings) })
  }

  const updateContent = (key: string, value: any) => {
    const newContent = { ...content, [key]: value }
    onUpdate({ content: JSON.stringify(newContent) })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Section Settings
        </h2>
        <p className="text-sm text-gray-600">
          {SECTION_TYPES.find((t) => t.value === section.type)?.label || section.type}
        </p>
      </div>

      <div className="space-y-6">
        {/* Visibility Toggle */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.visible}
              onChange={(e) => onUpdate({ visible: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Visible</span>
          </label>
        </div>

        {/* Spacing Controls */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spacing & Size</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding
              </label>
              <select
                value={settings.padding || "normal"}
                onChange={(e) => updateSettings("padding", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="none">None (0px)</option>
                <option value="small">Small (16px)</option>
                <option value="normal">Normal (32px) - Default</option>
                <option value="large">Large (64px)</option>
                <option value="xlarge">Extra Large (96px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Spacing
              </label>
              <select
                value={settings.spacing || "normal"}
                onChange={(e) => updateSettings("spacing", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="none">None (0px)</option>
                <option value="small">Small (24px)</option>
                <option value="normal">Normal (48px) - Default</option>
                <option value="large">Large (80px)</option>
                <option value="xlarge">Extra Large (120px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Width
              </label>
              <select
                value={settings.maxWidth || "full"}
                onChange={(e) => updateSettings("maxWidth", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="sm">Small (640px)</option>
                <option value="md">Medium (768px)</option>
                <option value="lg">Large (1024px)</option>
                <option value="xl">Extra Large (1280px)</option>
                <option value="2xl">2XL (1536px)</option>
                <option value="full">Full Width - Default</option>
              </select>
            </div>
          </div>
        </div>

        {/* Background & Colors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Colors</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={normalizeHexColor(settings.backgroundColor, "#ffffff")}
                  onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={settings.backgroundColor || "#ffffff"}
                  onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={normalizeHexColor(settings.textColor, "#000000")}
                  onChange={(e) => updateSettings("textColor", e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={settings.textColor || "#000000"}
                  onChange={(e) => updateSettings("textColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section-Specific Content */}
        {section.type === "hero" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={content.title || ""}
                  onChange={(e) => updateContent("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={content.subtitle || ""}
                  onChange={(e) => updateContent("subtitle", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <select
                  value={settings.height || "80vh"}
                  onChange={(e) => updateSettings("height", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="50vh">Small (50vh)</option>
                  <option value="60vh">Medium (60vh)</option>
                  <option value="80vh">Large (80vh) - Default</option>
                  <option value="100vh">Full Screen (100vh)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {section.type === "products" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Products
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={content.productCount || 6}
                  onChange={(e) => updateContent("productCount", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns (Desktop)
                </label>
                <select
                  value={content.columnsDesktop || "3"}
                  onChange={(e) => updateContent("columnsDesktop", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns - Default</option>
                  <option value="4">4 Columns</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {section.type === "about" || section.type === "text" ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={content.heading || ""}
                  onChange={(e) => updateContent("heading", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content.text || ""}
                  onChange={(e) => updateContent("text", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Alignment
                </label>
                <select
                  value={settings.textAlign || "center"}
                  onChange={(e) => updateSettings("textAlign", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="left">Left</option>
                  <option value="center">Center - Default</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {section.type === "image" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={content.imageUrl || ""}
                  onChange={(e) => updateContent("imageUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="/uploads/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={content.altText || ""}
                  onChange={(e) => updateContent("altText", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Description of the image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (optional)
                </label>
                <textarea
                  value={content.caption || ""}
                  onChange={(e) => updateContent("caption", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Image caption"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
