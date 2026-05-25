"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Eye, Mail, MessageCircle, PenLine, ThumbsUp, UserRound } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { getUserById } from "@/src/redux/slice/secondUserSlice";

interface AuthorSectionProps {
  authorId: string;
}

const AuthorSection = ({ authorId }: AuthorSectionProps) => {
  const dispatch = useAppDispatch();

  const {
    userId,
    userName,
    userEmail,
    firstName,
    lastName,
    profilePicture,
    bio,
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    latestPosts,
    topCategories,
    status,
  } = useSelector((state: any) => state.secondUser);

  const displayName = [firstName, lastName].filter(Boolean).join(" ") || userName || "NaijUp Author";
  const authorHandle = userName ? `@${userName}` : "NaijUp contributor";
  const bioParagraphs = Array.isArray(bio)
    ? bio.filter((paragraph: string) => paragraph?.trim())
    : [];

  useEffect(() => {
    if (authorId) {
      dispatch(getUserById(authorId));
    }
  }, [dispatch, authorId]);

  if (status === "pending") {
    return (
      <div className="mt-16 animate-pulse">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-soft dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="h-24 w-24 shrink-0 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="flex-1 space-y-4">
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-neutral-800" />
              <div className="h-5 w-48 rounded bg-gray-200 dark:bg-neutral-800" />
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-800" />
              <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="mx-auto mt-16 max-w-4xl rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
        Failed to load author information.
      </div>
    );
  }

  if (!userId) return null;

  return (
    <section className="mt-20" aria-labelledby="author-section-title">
      <div
        className="
          mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200
          bg-white shadow-soft dark:border-neutral-800 dark:bg-neutral-950
        "
      >
        <div className="h-1.5 bg-gradient-to-r from-accent via-profit to-accentDark" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-surface-light ring-4 ring-white dark:bg-surface-dark dark:ring-neutral-950 md:h-28 md:w-28">
              <Image
                src={profilePicture || "/image/profile-img.png"}
                alt={displayName}
                fill
                quality={80}
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent dark:bg-accentDark/10 dark:text-accentDark">
                  <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                  Written by
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray dark:text-neutral-300">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  {authorHandle}
                </span>
              </div>

              <h2
                id="author-section-title"
                className="mt-3 text-2xl font-semibold leading-tight text-dark dark:text-light md:text-3xl"
              >
                {displayName}
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-neutral-300 md:text-base">
                {bioParagraphs.length > 0 ? (
                  bioParagraphs.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>
                    {displayName} contributes reporting and analysis for NaijUp, covering the stories, markets, and business trends shaping Nigeria.
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
              {userName && (
                <Link
                  href={`/user/${userName}`}
                  className="inline-flex items-center gap-2 rounded-md bg-dark px-4 py-2 text-sm font-semibold text-light transition-colors hover:bg-dark/85 dark:bg-light dark:text-dark dark:hover:bg-light/85"
                >
                  View author page
                </Link>
              )}
              {userEmail && (
                <a
                  href={`mailto:${userEmail}`}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-dark transition-colors hover:border-accent hover:text-accent dark:border-neutral-800 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Contact author
                </a>
              )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-gray-200 pt-6 dark:border-neutral-800 md:grid-cols-4">
            {[
              { label: "Stories", value: totalPosts ?? 0, icon: PenLine },
              { label: "Reads", value: totalViews ?? 0, icon: Eye },
              { label: "Likes", value: totalLikes ?? 0, icon: ThumbsUp },
              { label: "Comments", value: totalComments ?? 0, icon: MessageCircle },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md bg-surface-light p-4 dark:bg-surface-dark">
                  <Icon className="h-4 w-4 text-accent dark:text-accentDark" aria-hidden="true" />
                  <p className="mt-2 text-2xl font-bold text-dark dark:text-light">{item.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray dark:text-neutral-400">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {!!topCategories?.length && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-dark dark:text-light">
                <BarChart3 className="h-4 w-4 text-accent dark:text-accentDark" aria-hidden="true" />
                Main desks
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {topCategories.map((item: any) => (
                  <Link
                    key={item.category}
                    href={`/categories/${item.category}`}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-dark/70 hover:border-accent hover:text-accent dark:border-neutral-800 dark:text-light/70 dark:hover:border-accentDark dark:hover:text-accentDark"
                  >
                    {item.category} ({item.posts})
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!latestPosts?.length && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-neutral-800">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray dark:text-neutral-400">
                Latest by {displayName}
              </h3>
              <div className="mt-4 space-y-3">
                {latestPosts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block rounded-md border border-gray-200 p-3 transition hover:border-accent hover:text-accent dark:border-neutral-800 dark:hover:border-accentDark dark:hover:text-accentDark"
                  >
                    <p className="font-semibold text-dark dark:text-light">{post.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray dark:text-neutral-400">
                      {post.category}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
