"use client"

// Global next/image loader. Cloudinary images are resized and format-converted
// by Cloudinary itself (f_auto picks avif/webp per browser) instead of Vercel's
// /_next/image optimizer, which is quota-limited and returns 402 for new images.
const CLOUDINARY_UPLOAD = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//

type LoaderParams = { src: string; width: number; quality?: number }

export default function imageLoader({ src, width, quality }: LoaderParams): string {
  const match = src.match(CLOUDINARY_UPLOAD)
  if (match) {
    const base = match[0].replace(/^http:/, "https:")
    const rest = src.slice(match[0].length)
    return `${base}f_auto,q_${quality ?? "auto"},w_${width},c_limit/${rest}`
  }
  // Local /public assets and other hosts are served as-is.
  return src
}
