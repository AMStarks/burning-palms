"use client"

import { useState } from "react"
import Image from "next/image"

type ProductImage = {
  url: string
  altText: string | null
}

type ProductImageGalleryProps = {
  images: ProductImage[]
  productTitle: string
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  const selectedImage = images[selectedImageIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || `${productTitle} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          priority={selectedImageIndex === 0}
        />
      </div>

      {/* Thumbnail Gallery - Always show if there are images */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              selectedImageIndex === index
                ? "border-accent-orange ring-2 ring-accent-orange/20"
                : "border-gray-200 hover:border-accent-orange/50"
            }`}
            aria-label={`View ${productTitle} image ${index + 1}`}
            type="button"
          >
            <Image
              src={image.url}
              alt={image.altText || `${productTitle} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
            {selectedImageIndex === index && (
              <div className="absolute inset-0 bg-accent-orange/10 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Image Navigation - show arrows if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
            aria-label="Previous image"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
            {selectedImageIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
            aria-label="Next image"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
