"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";

import AuthorProtectedRoute from "@/src/components/AuthorProtectedRoute";
import {
  fetchAuthorMe,
  fetchAuthorPosts,
  fetchSuperAuthorOverview,
  fetchSuperAuthorPosts,
  updateWriterPermission,
} from "@/src/redux/slice/authorSlice";

import Link from "next/link";
import { RootState } from "@/src/redux/store";
import { motion } from "framer-motion";
import { canAccessAdminReports } from "@/src/utils/adminAccess";
import { BarChart3, Eye, FileText, PenLine, ShieldCheck, UserPlus, Users } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatPeriodLabel = (start?: string, end?: string) => {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} - ${endDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

export default function AuthorDashboardClient() {
  const dispatch = useAppDispatch();

  const { stats, posts, status, superOverview, superPosts, superStatus } = useSelector((state: RootState) => state.author);
  const user = useSelector((state: RootState) => state.user);
  const canViewAdminReports = canAccessAdminReports(user?.userEmail);
  const monthlyStats = stats?.monthly_stats;

  // const [hoveredPost, setHoveredPost] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);
  const [selectedWriterId, setSelectedWriterId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.token) return;
    if (user?.token) {
      if (user.isAuthor) {
        dispatch(fetchAuthorMe(user.token));
        dispatch(fetchAuthorPosts({ token: user.token, page: 1 }));
      }
      if (canAccessAdminReports(user.userEmail)) {
        dispatch(fetchSuperAuthorOverview(user.token));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user?.token || !selectedWriterId) return;
    dispatch(fetchSuperAuthorPosts({ token: user.token, authorId: selectedWriterId }));
  }, [dispatch, selectedWriterId, user?.token]);

  if (!user) return null;

  return (
    <div className="p-8 space-y-10 bg-gray-100 dark:bg-dark min-h-screen transition duration-300">
      <AuthorProtectedRoute>
        {() => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-light">
              Welcome, {user.firstName}
            </h1>
            {canViewAdminReports && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                <ShieldCheck size={16} />
                Master author access enabled
              </p>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats */}
              <motion.div
                layout="position"
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-dark rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-light">Your Stats</h2>

                {!stats ? (
                  <p className="mt-3 text-gray-500 dark:text-light">
                    {user.isAuthor ? "Loading stats..." : "Master console access only."}
                  </p>
                ) : (
                  <div className="mt-3 text-gray-700 dark:text-light space-y-1">
                    <p>Total Posts: {stats.total_posts}</p>
                    <p>Total Views: {stats.total_views}</p>
                    <p>Avg Views/Post: {stats.average_views_per_post?.toFixed(1)}</p>
                    {monthlyStats && (
                      <>
                        <p className="pt-2 text-sm font-semibold text-gray-900 dark:text-light">
                          Current 28th cycle
                        </p>
                        <p className="text-sm">{formatPeriodLabel(monthlyStats.period_start, monthlyStats.period_end)}</p>
                        <p>Monthly Posts: {monthlyStats.monthly_total_posts}</p>
                        <p>Monthly Views: {monthlyStats.monthly_total_views}</p>
                        <p className="font-semibold text-green-700 dark:text-green-400">
                          Amount Due: {formatCurrency(monthlyStats.monthly_amount_due)}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                layout="position"
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-dark rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-light">Quick Actions</h2>
                <div className="flex flex-col space-y-3 mt-3">
                  <Link
                    href="/createpost"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
                  >
                    Create New Post
                  </Link>
                  <Link
                    href="/editpost"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg text-center hover:bg-gray-800 transition"
                  >
                    Manage Posts
                  </Link>
                  {canViewAdminReports && (
                    <Link
                      href="/admin/reports"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700 transition"
                    >
                      Open Admin Reports
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Profile */}
              <motion.div
                layout="position"
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-dark rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-light">Profile</h2>
                <p className="mt-3 text-gray-700 dark:text-light">{user.userEmail}</p>
                <Link
                  href="/edituserprofile"
                  className="block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
                >
                  Edit Profile
                </Link>
              </motion.div>
            </div>

            {canViewAdminReports && (
              <div className="mt-10 rounded-xl bg-white p-6 shadow-md dark:bg-dark">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck size={16} />
                      Master Author Console
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-light">
                      Writer insights and permissions
                    </h2>
                    {superOverview?.totals && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-light/60">
                        Cycle: {formatPeriodLabel(superOverview.totals.period_start, superOverview.totals.period_end)}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/admin/reports"
                    className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:border-emerald-600 dark:border-emerald-900 dark:text-emerald-300"
                  >
                    Full reports
                  </Link>
                </div>

                {superOverview?.totals && (
                  <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
                    {[
                      { label: "Writers", value: superOverview.totals.writers, icon: Users },
                      { label: "All Posts", value: superOverview.totals.posts, icon: FileText },
                      { label: "All Views", value: superOverview.totals.views, icon: Eye },
                      { label: "Cycle Posts", value: superOverview.totals.monthly_posts, icon: PenLine },
                      { label: "Cycle Views", value: superOverview.totals.monthly_views, icon: BarChart3 },
                      { label: "Due", value: formatCurrency(superOverview.totals.amount_due), icon: ShieldCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <Icon size={18} className="text-emerald-600 dark:text-emerald-300" />
                          <p className="mt-2 text-xl font-bold text-gray-900 dark:text-light">{item.value}</p>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-light/50">
                            {item.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-light">
                      <UserPlus size={18} />
                      Choose writer
                    </h3>
                    <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
                      {superOverview?.candidates?.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (candidate.is_author) setSelectedWriterId(candidate.id);
                              }}
                              className="text-left"
                            >
                              <p className="font-semibold text-gray-900 dark:text-light">
                                {[candidate.first_name, candidate.last_name].filter(Boolean).join(" ") || candidate.username}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-light/50">{candidate.email}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-light/50">
                                {candidate.posts_count} posts
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!user?.token) return;
                                dispatch(updateWriterPermission({
                                  token: user.token,
                                  userId: candidate.id,
                                  isAuthor: !candidate.is_author,
                                })).then(() => dispatch(fetchSuperAuthorOverview(user.token)));
                              }}
                              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                                candidate.is_author
                                  ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-200"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }`}
                            >
                              {candidate.is_author ? "Remove" : "Make writer"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 dark:text-light">
                        Writer performance
                      </h3>
                      <select
                        value={selectedWriterId ?? ""}
                        onChange={(event) => setSelectedWriterId(Number(event.target.value) || null)}
                        className="rounded-md border-gray-300 text-sm dark:border-gray-700 dark:bg-dark dark:text-light"
                      >
                        <option value="">Select writer</option>
                        {superOverview?.writers?.map((writer) => (
                          <option key={writer.author_id} value={writer.author_id}>
                            {writer.first_name || writer.username} - {writer.total_posts} posts
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedWriterId ? (
                      <div className="mt-4">
                        {superPosts?.author && (
                          <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                            <p className="font-semibold text-gray-900 dark:text-light">
                              {[superPosts.author.first_name, superPosts.author.last_name].filter(Boolean).join(" ") || superPosts.author.username}
                            </p>
                            <p className="text-gray-500 dark:text-light/50">{superPosts.author.email}</p>
                          </div>
                        )}
                        <div className="space-y-3">
                          {superPosts?.results?.map((post) => (
                            <div key={post.id} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="font-semibold text-gray-900 hover:text-blue-700 dark:text-light dark:hover:text-blue-300"
                              >
                                {post.title}
                              </Link>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-light/50">
                                <span>{post.category}</span>
                                <span>{post.total_views} total views</span>
                                <span>{post.monthly_views} cycle views</span>
                              </div>
                            </div>
                          ))}
                          {superStatus !== "loading" && selectedWriterId && !superPosts?.results?.length && (
                            <p className="text-sm text-gray-500 dark:text-light/50">No posts found for this writer.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-gray-500 dark:text-light/50">
                        Select a writer to inspect their post stats.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Section */}
            <div className="p-6 bg-white dark:bg-dark rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-light">
                Your Posts
              </h2>
              {monthlyStats && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                  Monthly payout for {formatPeriodLabel(monthlyStats.period_start, monthlyStats.period_end)}:{" "}
                  <span className="font-semibold">{formatCurrency(monthlyStats.monthly_amount_due)}</span>
                </div>
              )}

              {status === "loading" && (
                <p className="text-gray-600 dark:text-light">Loading posts...</p>
              )}

              <div className="space-y-6">
                {posts?.results?.map((post) => (
                  <motion.div
                    layout="position"
                    key={post.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl bg-gray-50 dark:bg-dark hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition relative"
                    onMouseEnter={() => setHoveredId(post.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-light">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-light">{post.category}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-700 dark:text-blue-300 mt-2 inline-block underline underline-offset-4"
                    >
                      View Post →
                    </Link>

                    {hoveredId === post.id && (
                      <motion.div
                        layout="position"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 top-0 p-4 bg-white dark:bg-dark shadow-xl w-64 rounded-lg"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-light">Post Stats</h4>
                        {post.stats ? (
                          <div className="mt-2 text-sm space-y-1 text-gray-700 dark:text-light">
                            <p>Total Views: {post.stats.total_views}</p>
                            <p>Unique Views: {post.stats.unique_views}</p>
                            <p>Avg Time: {post.stats.average_time_spent} sec</p>
                            <p>
                              Last Viewed:{" "}
                              {new Date(post.stats.last_viewed).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm mt-2">No stats yet.</p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AuthorProtectedRoute>
    </div>
  );
}
