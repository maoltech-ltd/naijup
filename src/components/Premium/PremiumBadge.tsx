export default function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3 fill-current">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
      Premium
    </span>
  );
}
