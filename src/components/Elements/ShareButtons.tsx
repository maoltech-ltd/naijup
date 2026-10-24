"use client";

import { Check, Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FacebookGlyph, LinkedinGlyph, WhatsappGlyph, XGlyph } from "./BrandIcons";

interface ShareButtonsProps {
  url: string;
  title: string;
  /** "card" is the large labelled block; "compact" is a single row of round buttons. */
  variant?: "card" | "compact";
  className?: string;
}

type ShareLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

export const buildShareLinks = (url: string, title: string): ShareLink[] => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${title}*\n\n${url}`)}`,
      icon: WhatsappGlyph,
      color: "bg-[#25D366] hover:bg-[#1ebe5b] text-white",
    },
    {
      name: "X",
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}&via=official_naijup`,
      icon: XGlyph,
      color: "bg-black hover:bg-neutral-800 text-white dark:ring-1 dark:ring-white/20",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookGlyph,
      color: "bg-[#1877F2] hover:bg-[#0f66d6] text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinGlyph,
      color: "bg-[#0A66C2] hover:bg-[#08539e] text-white",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      color: "bg-[#229ED9] hover:bg-[#1b8bc0] text-white",
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: MessageCircle,
      color: "bg-[#FF4500] hover:bg-[#e03d00] text-white",
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      icon: Mail,
      color: "bg-slate-600 hover:bg-slate-700 text-white",
    },
  ];
};

export const useShareActions = (url: string, title: string) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const nativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: title, url });
    } catch {
      // Users can cancel native share sheets; no UI error needed.
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return { copied, canNativeShare, nativeShare, copyLink };
};

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, variant = "card", className = "" }) => {
  const shareLinks = buildShareLinks(url, title);
  const { copied, canNativeShare, nativeShare, copyLink } = useShareActions(url, title);

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-dark dark:text-light">
          <Share2 className="h-4 w-4" aria-hidden />
          Share
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {shareLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Share on ${link.name}`}
                aria-label={`Share on ${link.name}`}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${link.color}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy article link"
            className={`inline-flex h-10 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition ${
              copied
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-dark/15 text-dark hover:border-accent hover:text-accent dark:border-light/20 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
            }`}
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="share-heading"
      className={`rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/[0.06] to-transparent p-5 shadow-sm sm:p-8 dark:border-accentDark/25 dark:from-accentDark/[0.08] ${className}`}
    >
      <h2
        id="share-heading"
        className="flex items-center gap-2 text-xl font-bold text-dark sm:text-2xl dark:text-light"
      >
        <Share2 className="h-6 w-6 text-accent dark:text-accentDark" aria-hidden />
        Found this useful? Share it
      </h2>
      <p className="mt-1 text-sm text-dark/70 dark:text-light/70">
        Help friends, family and colleagues stay informed on Nigerian finance.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${link.color}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.name}
            </a>
          );
        })}

        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy article link"
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition ${
            copied
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-dark/15 bg-light text-dark hover:border-accent hover:text-accent dark:border-light/20 dark:bg-dark dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
          }`}
        >
          {copied ? <Check className="h-5 w-5" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />}
          {copied ? "Link copied!" : "Copy link"}
        </button>
      </div>

      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 dark:bg-accentDark dark:text-dark"
        >
          <Share2 className="h-5 w-5" aria-hidden />
          More sharing options
        </button>
      )}
    </section>
  );
};

export default ShareButtons;
