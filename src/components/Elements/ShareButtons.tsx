"use client";

import {
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from "../icon";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: TwitterIcon,
      className: "hover:border-dark hover:text-dark dark:hover:border-light dark:hover:text-light",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
      className: "hover:border-blue-600 hover:text-blue-600",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsappIcon,
      className: "hover:border-green-600 hover:text-green-600",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinIcon,
      className: "hover:border-blue-700 hover:text-blue-700",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      className: "hover:border-sky-500 hover:text-sky-500",
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: MessageCircle,
      className: "hover:border-orange-600 hover:text-orange-600",
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      icon: Mail,
      className: "hover:border-accent hover:text-accent dark:hover:border-accentDark dark:hover:text-accentDark",
    },
  ];

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url });
    } catch {
      // Users can cancel native share sheets; no UI error needed.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 px-5 md:px-10">
      <span className="flex items-center gap-2 text-sm font-semibold text-dark dark:text-light">
        <Share2 size={18} />
        <span className="whitespace-nowrap">Share</span>
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark/10 text-dark transition hover:border-accent hover:text-accent dark:border-light/15 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
            aria-label="Open native share menu"
          >
            <Share2 size={18} />
          </button>
        )}

        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark/10 text-dark transition dark:border-light/15 dark:text-light ${link.className}`}
              aria-label={`Share on ${link.name}`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          );
        })}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-dark/10 px-3 text-sm font-medium text-dark transition hover:border-accent hover:text-accent dark:border-light/15 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
          aria-label="Copy post link"
        >
          <Copy size={17} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
