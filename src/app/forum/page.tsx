import type { Metadata } from "next";
import Link from "next/link";
import siteMetadata from "@/src/utils/sitemetadata";
import { MessageCircle, Pin } from "lucide-react";

export const revalidate = 30;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "economy", label: "Economy" },
  { value: "startups", label: "Startups" },
];

type ForumTopic = {
  id: number;
  title: string;
  slug: string;
  category: string;
  author_username: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  replies_count: number;
  created_at: string;
};

async function getTopics(category?: string) {
  try {
    const path = category
      ? `v1/forum/topics/?category=${encodeURIComponent(category)}&page_size=30`
      : "v1/forum/topics/?page_size=30";
    const res = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch (error) {
    console.error("Error fetching forum topics:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Community Forum — NaijUp",
  description:
    "Discuss Nigerian stocks, crypto, economy, and startups with the NaijUp community. Registered users can start topics and join the conversation.",
  alternates: { canonical: `${siteMetadata.siteUrl}/forum` },
};

export default async function ForumPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category;
  const topics: ForumTopic[] = await getTopics(category);

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
            Community
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Forum</h1>
          <p className="mt-3 max-w-2xl text-gray dark:text-light/60">
            Discuss stocks, crypto, the economy, and startups with other NaijUp readers. Any
            registered user can start a topic or join the conversation.
          </p>
        </div>
        <Link
          href="/forum/new"
          className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-light transition hover:bg-dark/85 dark:bg-light dark:text-dark dark:hover:bg-light/85"
        >
          New Topic
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={c.value ? `/forum?category=${c.value}` : "/forum"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              (category || "") === c.value
                ? "bg-dark text-light dark:bg-light dark:text-dark"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {topics.length ? (
        <div className="mt-8 flex flex-col divide-y divide-dark/10 dark:divide-light/10">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/forum/${topic.slug}`}
              className="flex items-center justify-between gap-4 py-4 hover:text-accent dark:hover:text-accentDark"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {topic.is_pinned && <Pin size={14} className="text-accent dark:text-accentDark" />}
                  <p className="truncate font-semibold">{topic.title}</p>
                </div>
                <p className="mt-1 text-sm text-gray dark:text-light/60">
                  {topic.author_username} · {topic.category}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm text-gray dark:text-light/60">
                <MessageCircle size={16} />
                {topic.replies_count}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-gray dark:text-light/60">
          No topics yet. Be the first to start a discussion.
        </div>
      )}
    </main>
  );
}
