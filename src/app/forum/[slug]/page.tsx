import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteMetadata from "@/src/utils/sitemetadata";
import BlogContent from "@/src/components/Blog/BlogContent";
import ForumReplySection from "@/src/components/Forum/ForumReplySection";

export const revalidate = 30;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

export type ForumReply = {
  id: number;
  topic: number;
  author: number;
  author_username: string;
  content: string;
  created_at: string;
};

export type ForumTopicDetail = {
  id: number;
  title: string;
  slug: string;
  content: any;
  category: string;
  author: number;
  author_username: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  replies: ForumReply[];
  created_at: string;
};

async function getTopic(slug: string): Promise<ForumTopicDetail | null> {
  try {
    const res = await fetch(`${apiBaseUrl}v1/forum/topics/${slug}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const topic = await res.json();
    if (!topic?.title) return null;
    return topic;
  } catch (error) {
    console.error("Error fetching forum topic:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = await getTopic(params.slug);
  if (!topic) {
    return { title: "Topic Not Found", robots: { index: false, follow: false } };
  }
  return {
    title: `${topic.title} — NaijUp Forum`,
    description: `Join the discussion: ${topic.title} — a NaijUp community forum topic in ${topic.category}.`,
    alternates: { canonical: `${siteMetadata.siteUrl}/forum/${params.slug}` },
  };
}

export default async function ForumTopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopic(params.slug);

  if (!topic) {
    notFound();
  }

  const t = topic as ForumTopicDetail;

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
        {t.category}
        {t.is_locked ? " · Locked" : ""}
      </p>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{t.title}</h1>
      <p className="mt-2 text-sm text-gray dark:text-light/60">
        {t.author_username} · {t.views_count} views · {t.replies?.length ?? 0} replies
      </p>

      <div className="mt-8">
        <BlogContent content={t.content} />
      </div>

      <ForumReplySection
        topicSlug={t.slug}
        topicAuthorId={t.author}
        isLocked={t.is_locked}
        initialReplies={t.replies || []}
      />
    </main>
  );
}
