"use client";

import { useEffect } from "react";
import api from "@/src/api";

// Records a "read": runs only in a visitor's browser after the post page has
// opened. Server renders and social link-preview crawlers never execute this,
// so they are counted as impressions on the backend instead of reads.
export default function ReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    const key = `naijup:read:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage unavailable (private mode etc.) — the backend still de-dupes.
    }
    api.post(`v1/blog/post/slug/${encodeURIComponent(slug)}/read/`).catch(() => {});
  }, [slug]);

  return null;
}
