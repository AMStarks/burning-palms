"use client"

export type CompressOptions = {
  maxWidth?: number
  maxHeight?: number
  maxBytes?: number
  initialQuality?: number
  minQuality?: number
}

export async function compressImageFile(
  file: File,
  {
    maxWidth = 1920,
    maxHeight = 1920,
    maxBytes = 3_500_000,
    initialQuality = 0.82,
    minQuality = 0.5,
  }: CompressOptions = {}
): Promise<File> {
  // Only attempt to compress images
  if (!file.type.startsWith("image/")) return file

  const img = await loadImage(file)

  const { width: srcW, height: srcH } = img
  const ratio = Math.min(maxWidth / srcW, maxHeight / srcH, 1)
  const dstW = Math.max(1, Math.round(srcW * ratio))
  const dstH = Math.max(1, Math.round(srcH * ratio))

  const canvas = document.createElement("canvas")
  canvas.width = dstW
  canvas.height = dstH

  const ctx = canvas.getContext("2d")
  if (!ctx) return file

  ctx.drawImage(img, 0, 0, dstW, dstH)

  // Always output JPEG for reliable size reduction
  let quality = initialQuality
  let blob = await canvasToBlob(canvas, "image/jpeg", quality)

  while (blob && blob.size > maxBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 0.08)
    blob = await canvasToBlob(canvas, "image/jpeg", quality)
  }

  if (!blob) return file

  const outName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"
  return new File([blob], outName, { type: "image/jpeg" })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), type, quality)
  })
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

