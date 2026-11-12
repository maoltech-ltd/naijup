import Image from "next/image"
import { cs } from "@/src/utils"

const CLOUDINARY_UPLOAD = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//

// ~1 KB heavily blurred rendition used as the frame backdrop.
const blurredBackdrop = (src: string) => {
  const match = src.match(CLOUDINARY_UPLOAD)
  if (!match) return null
  const base = match[0].replace(/^http:/, "https:")
  return `${base}f_auto,q_auto:low,w_48,e_blur:400/${src.slice(match[0].length)}`
}

type FramedImageProps = {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  /** Frame classes: aspect ratio, rounding, etc. */
  className?: string
  imgClassName?: string
}

// NaijUp covers are often infographics (charts, headline text) in mixed
// shapes: 3:2, 1.9:1, square, portrait. Cropping them with object-cover cuts
// words off, so the whole image is shown (object-contain) inside a fixed frame
// and any leftover space is filled with a blurred copy of the same picture.
export default function FramedImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imgClassName,
}: FramedImageProps) {
  const backdrop = blurredBackdrop(src)

  return (
    <div className={cs("relative isolate overflow-hidden bg-dark/5 dark:bg-light/5", className)}>
      {backdrop && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backdrop}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-70 blur-md"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className={cs("object-contain object-center", imgClassName)}
      />
    </div>
  )
}
