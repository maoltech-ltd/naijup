// "use client";

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";

// import AuthorProtectedRoute from "@/src/components/AuthorProtectedRoute";
// import { fetchAuthorMe, fetchAuthorPosts } from "@/src/redux/slice/authorSlice";

// import Link from "next/link";
// import { RootState } from "@/src/redux/store";
// import { motion } from "framer-motion";

// export default function AuthorDashboardClient() {
//   const dispatch = useAppDispatch();

//   const { stats, posts, status } = useSelector((state: RootState) => state.author);
//   const user = useSelector((state: RootState) => state.user);

//   const [hoveredPost, setHoveredPost] = useState<any>(null);

//   useEffect(() => {
//     if (user?.token) {
//       dispatch(fetchAuthorMe(user.token));
//       dispatch(fetchAuthorPosts({ token: user.token, page: 1 }));
//     }
//   }, [user]);

//   if (!user) return null;

//   return (
//       <div className="p-8 space-y-10 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300">
//         {/* Theme Toggle */}

//         <AuthorProtectedRoute>
//           {() => (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {user.firstName}</h1>

//               {/* Stats */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
//                 >
//                   <h2 className="text-xl font-semibold dark:text-white">Your Stats</h2>

//                   {!stats ? (
//                     <p className="mt-3 text-gray-400">Loading stats…</p>
//                   ) : (
//                     <div className="mt-3 text-gray-700 dark:text-gray-300 space-y-1">
//                       <p>Total Posts: {stats.total_posts}</p>
//                       <p>Total Views: {stats.total_views}</p>
//                       <p>Avg Views/Post: {stats.average_views_per_post?.toFixed(1)}</p>
//                     </div>
//                   )}
//                 </motion.div>

//                 {/* Quick Actions */}
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
//                 >
//                   <h2 className="text-xl font-semibold dark:text-white">Quick Actions</h2>
//                   <div className="flex flex-col space-y-3 mt-3">
//                     <Link
//                       href="/createpost"
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
//                     >
//                       Create New Post
//                     </Link>
//                     <Link
//                       href="/editpost"
//                       className="px-4 py-2 bg-gray-700 text-white rounded-lg text-center hover:bg-gray-800 transition"
//                     >
//                       Manage Posts
//                     </Link>
//                   </div>
//                 </motion.div>

//                 {/* Profile */}
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
//                 >
//                   <h2 className="text-xl font-semibold dark:text-white">Profile</h2>
//                   <p className="mt-3 text-gray-600 dark:text-gray-300">{user.userEmail}</p>
//                   <Link
//                     href="/edituserprofile"
//                     className="block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
//                   >
//                     Edit Profile
//                   </Link>
//                 </motion.div>
//               </div>

//               {/* Posts */}
//               <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
//                 <h2 className="text-2xl font-semibold mb-4 dark:text-white">Your Posts</h2>

//                 {status === "loading" && <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>}

//                 {posts?.results?.map((post) => (
//                   <motion.div
//                     key={post.id}
//                     whileHover={{ scale: 1.01 }}
//                     className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative cursor-pointer transition"
//                     onMouseEnter={() => setHoveredPost(post)}
//                     onMouseLeave={() => setHoveredPost(null)}
//                   >
//                     <h3 className="text-lg font-semibold dark:text-white">{post.title}</h3>
//                     <p className="text-gray-500 dark:text-gray-300">{post.category}</p>

//                     <Link
//                       href={`/blog/${post.slug}`}
//                       className="text-blue-600 dark:text-blue-400 mt-1 inline-block hover:underline"
//                     >
//                       View Post →
//                     </Link>

//                     {hoveredPost?.id === post.id && (
//                       <motion.div
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="absolute right-0 top-0 p-4 bg-white dark:bg-gray-700 shadow-lg w-60 rounded-lg"
//                       >
//                         <h4 className="font-semibold dark:text-white">Post Stats</h4>
//                         {post.stats ? (
//                           <div className="mt-2 text-sm space-y-1 text-gray-700 dark:text-gray-300">
//                             <p>Total Views: {post.stats.total_views}</p>
//                             <p>Unique Views: {post.stats.unique_views}</p>
//                             <p>Avg Time: {post.stats.average_time_spent} sec</p>
//                             <p>Last Viewed: {new Date(post.stats.last_viewed).toLocaleString()}</p>
//                           </div>
//                         ) : (
//                           <p className="text-gray-400 text-sm mt-2">No stats yet.</p>
//                         )}
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AuthorProtectedRoute>
//       </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";

import AuthorProtectedRoute from "@/src/components/AuthorProtectedRoute";
import { fetchAuthorMe, fetchAuthorPosts } from "@/src/redux/slice/authorSlice";

import Link from "next/link";
import { RootState } from "@/src/redux/store";
import { motion } from "framer-motion";

export default function AuthorDashboardClient() {
  const dispatch = useAppDispatch();

  const { stats, posts, status } = useSelector((state: RootState) => state.author);
  const user = useSelector((state: RootState) => state.user);

  const [hoveredPost, setHoveredPost] = useState<any>(null);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchAuthorMe(user.token));
      dispatch(fetchAuthorPosts({ token: user.token, page: 1 }));
    }
  }, [user, dispatch]);

  if (!user) return null;

  return (
    <div className="p-8 space-y-10 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300">
      <AuthorProtectedRoute>
        {() => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Welcome, {user.firstName}
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Your Stats</h2>

                {!stats ? (
                  <p className="mt-3 text-gray-500 dark:text-gray-400">Loading stats…</p>
                ) : (
                  <div className="mt-3 text-gray-700 dark:text-gray-300 space-y-1">
                    <p>Total Posts: {stats.total_posts}</p>
                    <p>Total Views: {stats.total_views}</p>
                    <p>Avg Views/Post: {stats.average_views_per_post?.toFixed(1)}</p>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
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
                </div>
              </motion.div>

              {/* Profile */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Profile</h2>
                <p className="mt-3 text-gray-700 dark:text-gray-300">{user.userEmail}</p>
                <Link
                  href="/edituserprofile"
                  className="block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
                >
                  Edit Profile
                </Link>
              </motion.div>
            </div>

            {/* Posts Section */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-50">
                Your Posts
              </h2>

              {status === "loading" && (
                <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
              )}

              <div className="space-y-6">
                {posts?.results?.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition relative"
                    onMouseEnter={() => setHoveredPost(post)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{post.category}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 mt-2 inline-block hover:underline"
                    >
                      View Post →
                    </Link>

                    {hoveredPost?.id === post.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 top-0 p-4 bg-white dark:bg-gray-700 shadow-xl w-64 rounded-lg"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-gray-50">Post Stats</h4>
                        {post.stats ? (
                          <div className="mt-2 text-sm space-y-1 text-gray-700 dark:text-gray-300">
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
