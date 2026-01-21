"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export function PublishToggleButton({
  pageId,
  currentStatus,
}: {
  pageId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const nextStatus = currentStatus === "published" ? "draft" : "published"
  const label = currentStatus === "published" ? "Unpublish" : "Publish"

  const onClick = () => {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/pages/${pageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || "Failed to update status")
        }
        router.refresh()
      } catch (e: any) {
        setError(e?.message || "Failed to update status")
      }
    })
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
          currentStatus === "published"
            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
            : "bg-accent-orange text-white hover:bg-accent-orange/90"
        }`}
      >
        {isPending ? "Updating..." : label}
      </button>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  )
}

