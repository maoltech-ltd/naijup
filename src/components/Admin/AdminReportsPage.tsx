"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import api from "@/src/api";
import AdminProtectedRoute from "@/src/components/AdminProtectedRoute";

interface AdminAuthorSummary {
  author_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  total_posts: number;
  total_views: number;
  monthly_total_posts: number;
  monthly_total_views: number;
  amount_due: number;
  period_start: string;
  period_end: string;
}

interface AdminAuthorPostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  period_start: string;
  period_end: string;
  monthly_total_posts: number;
  monthly_total_views: number;
  amount_due: number;
  results: Array<{
    id: number;
    title: string;
    slug: string;
    category: string;
    publication_date: string;
    total_views: number;
    monthly_views: number;
  }>;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminReportsPage() {
  const user = useSelector((state: RootState) => state.user);
  const [authors, setAuthors] = useState<AdminAuthorSummary[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [postsData, setPostsData] = useState<AdminAuthorPostsResponse | null>(null);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [authorsError, setAuthorsError] = useState("");
  const [postsError, setPostsError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user.token) return;

    const loadAuthors = async () => {
      setAuthorsLoading(true);
      setAuthorsError("");
      try {
        const response = await api.get("v1/admin/admin/reports/authors/", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const summaries = response.data as AdminAuthorSummary[];
        setAuthors(summaries);
        setSelectedAuthorId((current) => current ?? summaries[0]?.author_id ?? null);
      } catch (error: any) {
        setAuthorsError(
          error?.response?.data?.detail || "Failed to load admin author reports."
        );
      } finally {
        setAuthorsLoading(false);
      }
    };

    loadAuthors();
  }, [user.token]);

  useEffect(() => {
    if (!user.token || !selectedAuthorId) return;

    const loadPosts = async () => {
      setPostsLoading(true);
      setPostsError("");
      try {
        const response = await api.get(
          `v1/admin/admin/reports/authors/${selectedAuthorId}/posts/?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setPostsData(response.data as AdminAuthorPostsResponse);
      } catch (error: any) {
        setPostsError(
          error?.response?.data?.detail || "Failed to load author posts report."
        );
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [page, selectedAuthorId, user.token]);

  useEffect(() => {
    setPage(1);
  }, [selectedAuthorId]);

  return (
    <AdminProtectedRoute>
      {() => (
        <div className="min-h-screen bg-slate-100 px-4 py-8 dark:bg-dark md:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-light">
                Admin Author Reports
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Reporting window always runs from the 28th of one month to the 28th of the next month.
              </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {authorsLoading && (
                <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-900">
                  Loading author summaries...
                </div>
              )}
              {authorsError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                  {authorsError}
                </div>
              )}
              {!authorsLoading &&
                !authorsError &&
                authors.map((author) => {
                  const name =
                    `${author.first_name} ${author.last_name}`.trim() || author.username;
                  const isActive = selectedAuthorId === author.author_id;
                  return (
                    <motion.button
                      key={author.author_id}
                      whileHover={{ scale: 1.01 }}
                      type="button"
                      onClick={() => setSelectedAuthorId(author.author_id)}
                      className={`rounded-2xl border p-6 text-left shadow-md transition ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/30"
                          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 dark:text-light">
                            {name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                            {author.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                          {author.monthly_total_posts} posts
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                        <p>
                          Window: {formatDate(author.period_start)} - {formatDate(author.period_end)}
                        </p>
                        <p>Total Posts: {author.total_posts}</p>
                        <p>Total Views: {author.total_views}</p>
                        <p>Monthly Views: {author.monthly_total_views}</p>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Amount Due: {formatCurrency(author.amount_due)}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-900">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-light">
                    Author Post Report
                  </h2>
                  {postsData && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      {formatDate(postsData.period_start)} - {formatDate(postsData.period_end)}
                    </p>
                  )}
                </div>
                {postsData && (
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
                    <p>Monthly Posts: {postsData.monthly_total_posts}</p>
                    <p>Monthly Views: {postsData.monthly_total_views}</p>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Amount Due: {formatCurrency(postsData.amount_due)}
                    </p>
                  </div>
                )}
              </div>

              {postsLoading && <p className="pt-6 text-slate-600 dark:text-slate-300">Loading post performance...</p>}
              {postsError && (
                <p className="pt-6 text-red-600 dark:text-red-300">{postsError}</p>
              )}
              {!postsLoading && !postsError && postsData && (
                <>
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                      <thead>
                        <tr className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <th className="py-3 pr-4">Post</th>
                          <th className="py-3 pr-4">Category</th>
                          <th className="py-3 pr-4">Published</th>
                          <th className="py-3 pr-4">Total Views</th>
                          <th className="py-3">Monthly Views</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {postsData.results.map((post) => (
                          <tr key={post.id} className="text-sm text-slate-700 dark:text-slate-200">
                            <td className="py-4 pr-4 font-medium">{post.title}</td>
                            <td className="py-4 pr-4">{post.category}</td>
                            <td className="py-4 pr-4">{formatDate(post.publication_date)}</td>
                            <td className="py-4 pr-4">{post.total_views}</td>
                            <td className="py-4">{post.monthly_views}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Showing page {page} of {Math.max(1, Math.ceil(postsData.count / 10))}
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={!postsData.previous || postsLoading}
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={!postsData.next || postsLoading}
                        onClick={() => setPage((current) => current + 1)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      )}
    </AdminProtectedRoute>
  );
}
