import Link from "next/link"
import { ArrowRight } from "lucide-react"

type SectionHeaderProps = {
  eyebrow: string
  title: string
  href?: string
  linkLabel?: string
  as?: "h2" | "h3"
}

// Shared masthead-style header for homepage sections: thick rule on top,
// small accent eyebrow, serif-weight title and an optional "View all" link.
export default function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  as: Tag = "h2",
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-t-[3px] border-dark pt-3 dark:border-light md:mb-8">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent dark:text-accentDark">
          {eyebrow}
        </p>
        <Tag className="mt-1 text-2xl font-extrabold capitalize tracking-tight text-dark dark:text-light md:text-3xl">
          {title}
        </Tag>
      </div>
      {href && (
        <Link
          href={href}
          className="group/link inline-flex shrink-0 items-center gap-1 rounded-full border border-dark/15 px-3 py-1.5 text-xs font-semibold text-dark transition-colors hover:border-accent hover:text-accent dark:border-light/20 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark sm:text-sm"
        >
          {linkLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
