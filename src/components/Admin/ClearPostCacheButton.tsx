"use client";

import { useState } from "react";
import { DatabaseZap } from "lucide-react";
import api from "@/src/api";

/**
 * Clears the Redis cache for a single post. Super admins can clear any post;
 * authors can clear only their own (enforced by the API).
 */
export default function ClearPostCacheButton({
  slug,
  token,
  className = "",
}: {
  slug: string;
  token?: string | null;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!token || !slug) return null;

  const clear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState("busy");
    setMessage("");
    try {
      await api.post(
        `v1/admin/author/posts/${encodeURIComponent(slug)}/cache/clear/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setState("done");
      setMessage("Cache cleared");
      setTimeout(() => setState((s) => (s === "done" ? "idle" : s)), 3000);
    } catch (err: any) {
      setState("error");
      setMessage(err?.response?.data?.detail || err?.message || "Failed to clear cache");
    }
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={clear}
        disabled={state === "busy"}
        title="Clear this post's cached copy so readers get the latest version"
        className="inline-flex items-center gap-1 rounded-md border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
      >
        <DatabaseZap size={14} />
        {state === "busy" ? "Clearing…" : "Clear cache"}
      </button>
      {message && (
        <span
          role={state === "error" ? "alert" : undefined}
          className={`text-xs ${state === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300"}`}
        >
          {message}
        </span>
      )}
    </span>
  );
}
