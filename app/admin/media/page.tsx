"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { compressImageFile } from "@/lib/image-compress"

type MediaFile = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt: string | null
  createdAt: string
  uploadedBy: {
    name: string | null
    email: string
  }
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/admin/media")
      const data = await response.json()
      setMedia(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching media:", error)
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    const compressed = await compressImageFile(file).catch(() => file)
    if (compressed.size > 4_000_000) {
      alert("File is too large. Please upload an image under ~4MB.")
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }
    formData.append("file", compressed)

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      await fetchMedia()
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      await fetchMedia()
      if (selectedMedia?.id === id) {
        setSelectedMedia(null)
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("Failed to delete file")
    }
  }

  const handleUpdateAlt = async (id: string, alt: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt }),
      })

      if (!response.ok) {
        throw new Error("Update failed")
      }

      await fetchMedia()
    } catch (error) {
      console.error("Error updating alt text:", error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/")
  }

  const filteredMedia = media.filter((item) =>
    item.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading media library...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-4xl text-accent-dark mb-2">
            Media Library
          </h1>
          <p className="text-gray-600">Manage your media files</p>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
          />
          <div className="flex gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-l-lg ${
                viewMode === "grid"
                  ? "bg-accent-orange text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-r-lg ${
                viewMode === "list"
                  ? "bg-accent-orange text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              List
            </button>
          </div>
          <label className="px-6 py-2 bg-accent-orange text-white font-display rounded-lg hover:bg-accent-orange/90 transition-colors cursor-pointer">
            {uploading ? "Uploading..." : "+ Upload Media"}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Media Area */}
        <div className={selectedMedia ? "flex-1" : "w-full"}>
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">
                {searchQuery ? "No media found matching your search." : "No media files yet."}
              </p>
              <label className="inline-block px-6 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 cursor-pointer">
                Upload Your First File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-accent-orange"
                  onClick={() => setSelectedMedia(item)}
                >
                  {isImage(item.mimeType) ? (
                    <div className="relative aspect-square rounded-t-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.url}
                        alt={item.alt || item.originalName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-t-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-xs text-gray-500 truncate px-2">
                          {item.originalName}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {item.originalName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(item.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedia.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isImage(item.mimeType) ? (
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={item.url}
                              alt={item.alt || item.originalName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                            📄
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.originalName}
                        </div>
                        {item.alt && (
                          <div className="text-sm text-gray-500">{item.alt}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.mimeType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                          className="text-red-600 hover:text-red-900"
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

        {/* Sidebar - Media Details */}
        {selectedMedia && (
          <div className="w-80 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-accent-dark">
                Media Details
              </h2>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {isImage(selectedMedia.mimeType) && (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.originalName}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Name
                </label>
                <div className="text-sm text-gray-900 break-words">
                  {selectedMedia.originalName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={selectedMedia.alt || ""}
                  onChange={(e) => {
                    const updated = { ...selectedMedia, alt: e.target.value }
                    setSelectedMedia(updated)
                  }}
                  onBlur={() =>
                    handleUpdateAlt(selectedMedia.id, selectedMedia.alt || "")
                  }
                  placeholder="Describe this image..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedMedia.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMedia.url)
                      alert("URL copied to clipboard!")
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">File Size</div>
                  <div className="font-medium">
                    {formatFileSize(selectedMedia.size)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Type</div>
                  <div className="font-medium">{selectedMedia.mimeType}</div>
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">Uploaded</div>
                <div className="text-sm">
                  {new Date(selectedMedia.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedMedia.id)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
