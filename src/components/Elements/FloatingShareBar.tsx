"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { buildShareLinks, useShareActions } from "./ShareButtons";

interface FloatingShareBarProps {
  url: string;
  title: string;
}

// Stays in view while reading: a vertical rail on the left on desktop,
// a bottom bar on mobile. Hidden until the reader scrolls past the hero.
const FloatingShareBar: React.FC<FloatingShareBarProps> = ({ url, title }) => {
  const [visible, setVisible] = useState(false);
  const { copied, canNativeShare, nativeShare, copyLink } = useShareActions(url, title);
  const shareLinks = buildShareLinks(url, title).slice(0, 4);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 600;
      const nearFooter =
        window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 700;
      setVisible(pastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hiddenClasses = "pointer-events-none opacity-0";

  return (
    <>
      {/* Desktop rail */}
      <div
        className={`fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full border border-dark/10 bg-light/95 p-2 shadow-lg backdrop-blur transition-opacity duration-300 xl:flex dark:border-light/10 dark:bg-dark/95 ${
          visible ? "opacity-100" : hiddenClasses
        }`}
        aria-hidden={!visible}
      >
        <span className="px-1 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-dark/60 dark:text-light/60">
          Share
        </span>
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${link.name}`}
              aria-label={`Share on ${link.name}`}
              tabIndex={visible ? 0 : -1}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-110 ${link.color}`}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
        <button
          type="button"
          onClick={copyLink}
          title="Copy link"
          aria-label="Copy article link"
          tabIndex={visible ? 0 : -1}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-110 ${
            copied ? "bg-emerald-600 text-white" : "bg-slate-200 text-dark dark:bg-slate-700 dark:text-light"
          }`}
        >
          {copied ? <Check className="h-5 w-5" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {/* Mobile / tablet bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-dark/10 bg-light/95 px-3 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 xl:hidden dark:border-light/10 dark:bg-dark/95 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-hidden={!visible}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-dark/70 dark:text-light/70">
            Share
          </span>
          <div className="flex items-center gap-2">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${link.name}`}
                  tabIndex={visible ? 0 : -1}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${link.color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
            <button
              type="button"
              onClick={canNativeShare ? nativeShare : copyLink}
              aria-label={canNativeShare ? "More sharing options" : "Copy article link"}
              tabIndex={visible ? 0 : -1}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                copied ? "bg-emerald-600 text-white" : "bg-accent text-white dark:bg-accentDark dark:text-dark"
              }`}
            >
              {copied ? (
                <Check className="h-5 w-5" aria-hidden />
              ) : canNativeShare ? (
                <Share2 className="h-5 w-5" aria-hidden />
              ) : (
                <Link2 className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingShareBar;
