"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type MenuItem = {
  id?: string
  label: string
  url: string
  order: number
  children?: MenuItem[]
}

type Menu = {
  id: string
  name: string
  location: string | null
  items: MenuItem[]
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newMenuName, setNewMenuName] = useState("")
  const [newMenuLocation, setNewMenuLocation] = useState("header")

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/menus")
      if (!res.ok) {
        console.error("Failed to fetch menus:", res.status, res.statusText)
        setMenus([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setMenus(data)
      } else {
        console.error("Menus data is not an array:", data)
        setMenus([])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching menus:", error)
      setMenus([])
      setLoading(false)
    }
  }

  const handleCreateMenu = async () => {
    if (!newMenuName.trim()) return

    try {
      const res = await fetch("/api/admin/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMenuName,
          location: newMenuLocation || null,
        }),
      })

      if (res.ok) {
        await fetchMenus()
        setNewMenuName("")
        setNewMenuLocation("header")
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Error creating menu:", error)
    }
  }

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu?")) return

    try {
      const res = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await fetchMenus()
        if (editingMenu?.id === id) {
          setEditingMenu(null)
        }
      }
    } catch (error) {
      console.error("Error deleting menu:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading menus...</div>
      </div>
    )
  }

  if (editingMenu) {
    return (
      <MenuEditor
        menu={editingMenu}
        onSave={async () => {
          await fetchMenus()
          setEditingMenu(null)
        }}
        onCancel={() => setEditingMenu(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
          <p className="text-gray-600 mt-1">Manage navigation menus</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Menu"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Menu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Name
              </label>
              <input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                placeholder="e.g., Main Menu, Footer Menu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={newMenuLocation}
                onChange={(e) => setNewMenuLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="">None (Custom)</option>
              </select>
            </div>
            <button
              onClick={handleCreateMenu}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
            >
              Create Menu
            </button>
          </div>
        </div>
      )}

      {menus.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No menus found.</p>
          <p className="text-sm text-gray-400">Create your first menu to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {menu.location || "Custom"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {menu.items.length} item{menu.items.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingMenu(menu)}
                      className="text-accent-orange hover:text-accent-orange/80 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MenuEditor({
  menu,
  onSave,
  onCancel,
}: {
  menu: Menu
  onSave: () => void
  onCancel: () => void
}) {
  const [items, setItems] = useState<MenuItem[]>(menu.items || [])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        onSave()
      }
    } catch (error) {
      console.error("Error saving menu:", error)
    } finally {
      setSaving(false)
    }
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        label: "New Item",
        url: "#",
        order: items.length,
      },
    ])
  }

  const updateItem = (index: number, updates: Partial<MenuItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    setItems(newItems)
  }

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i })))
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return
    }

    const newItems = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    
    // Update orders
    newItems.forEach((item, i) => {
      item.order = i
    })
    
    setItems(newItems)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Menu: {menu.name}</h1>
          <p className="text-gray-600 mt-1">Manage menu items</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Menu"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
          >
            Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No menu items yet. Click "Add Item" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateItem(index, { url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                      placeholder="/page or https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
