"use client";

import { useState } from "react";
import { DatabaseZap } from "lucide-react";
import api from "@/src/api";

const input =
  "mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white";

function apiError(e: any) {
  return e?.response?.data?.detail || e?.message || "Request failed.";
}

/** Extract a slug from either a bare slug or a full /blog/<slug> URL. */
function toSlug(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/\/blog\/([^/?#]+)/);
  return decodeURIComponent(match ? match[1] : trimmed.replace(/^\/+|\/+$/g, ""));
}

/** Super-admin tool to clear cached posts from Redis. */
export default function PostCacheTools({ token }: { token: string }) {
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState<"" | "post" | "all">("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const clear = async (scope: "post" | "all") => {
    const target = scope === "post" ? toSlug(slug) : "";
    if (scope === "post" && !target) return;
    if (scope === "all" && !window.confirm("Clear ALL cached posts from Redis? Pages will reload from the database.")) {
      return;
    }
    setBusy(scope);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post(
        "v1/admin/admin/cache/posts/clear/",
        target ? { slug: target } : {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotice(
        scope === "post"
          ? `Cleared cache for "${target}" (${data.deleted} key${data.deleted === 1 ? "" : "s"}).`
          : `Cleared all cached posts (${data.deleted} key${data.deleted === 1 ? "" : "s"}).`
      );
      if (scope === "post") setSlug("");
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-light">
        <DatabaseZap size={18} className="text-emerald-600 dark:text-emerald-300" />
        Post cache (Redis)
      </h3>

      <form
        className="mt-4 flex flex-wrap items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          clear("post");
        }}
      >
        <label className="min-w-[240px] flex-1 text-sm text-gray-700 dark:text-light/80">
          Post slug or URL
          <input
            className={input}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-post-slug or https://naijup.ng/blog/my-post-slug"
          />
        </label>
        <button
          type="submit"
          disabled={!slug.trim() || !!busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy === "post" ? "Clearing…" : "Clear this post"}
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => clear("all")}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          {busy === "all" ? "Clearing…" : "Clear all posts"}
        </button>
      </form>

      <p className="mt-2 text-xs text-gray-500 dark:text-light/50">
        Clearing a post removes its cached page and related posts. Clearing all posts also removes cached post lists
        (latest, categories, most read, analysis). Market data is not affected.
      </p>
      {notice && <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
