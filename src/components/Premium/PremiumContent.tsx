"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import BlogContent from "@/src/components/Blog/BlogContent";
import { getFullPost } from "@/src/utils/premium";

// The page is server-rendered without the reader's token, so a premium post
// always arrives as a preview (`is_locked`). Signed-in readers re-fetch it
// with their token; the API returns the full post if they're entitled.
export default function PremiumContent({
  slug,
  content,
  isPremium,
  isLocked,
}: {
  slug: string;
  content: any;
  isPremium?: boolean;
  isLocked?: boolean;
}) {
  const user = useSelector((state: RootState) => state.user);
  const [fullContent, setFullContent] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const needsUnlock = Boolean(isPremium && isLocked);

  useEffect(() => {
    if (!needsUnlock || !user?.token) return;
    let cancelled = false;
    setChecking(true);
    getFullPost(slug, user.token)
      .then((post) => {
        if (!cancelled && post && !post.is_locked) setFullContent(post.content);
      })
      .catch(() => {})
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, [needsUnlock, slug, user?.token]);

  if (!needsUnlock || fullContent) {
    return <BlogContent content={fullContent || content} />;
  }

  return (
    <div>
      <div className="relative">
        <BlogContent content={content} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-light dark:from-dark" />
      </div>
      <div className="premium-paywall mt-6 rounded-2xl border border-amber-300/60 bg-amber-50 p-6 text-center dark:border-amber-400/30 dark:bg-amber-400/5 md:p-8">
        {checking ? (
          <p className="text-sm text-dark/70 dark:text-light/70">Checking your subscription…</p>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              NaijUp Premium
            </p>
            <h2 className="mt-2 text-xl font-bold text-dark dark:text-light md:text-2xl">
              Keep reading with Premium
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-dark/70 dark:text-light/70">
              Subscribe for full access to premium posts and the Investment Analysis section, with an
              email whenever a new post goes live.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/premium"
                className="rounded-full bg-dark px-6 py-2.5 text-sm font-semibold text-light transition hover:opacity-90 dark:bg-light dark:text-dark"
              >
                See plans
              </Link>
              {!user?.token && (
                <Link
                  href="/signin"
                  className="rounded-full border border-dark/20 px-6 py-2.5 text-sm font-semibold text-dark transition hover:bg-dark/5 dark:border-light/20 dark:text-light dark:hover:bg-light/5"
                >
                  Already subscribed? Sign in
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
