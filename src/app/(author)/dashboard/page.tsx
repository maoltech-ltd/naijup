"use client";

import AuthorProtectedRoute from "@/src/components/AuthorProtectedRoute";
import Link from "next/link";
import { UserState } from "@/src/redux/slice/userSlice";

export default function AuthorDashboardPage() {
  return (
    <AuthorProtectedRoute>
      {({ user }: { user: UserState }) => (
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">Your Stats</h2>
              <p className="text-gray-500 mt-2">Posts: 12</p>
              <p className="text-gray-500">Drafts: 3</p>
              <p className="text-gray-500">Total Views: 4,230</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">Quick Actions</h2>

              <div className="flex flex-col space-y-3 mt-3">
                <Link
                  href="/createpost"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                >
                  Create New Post
                </Link>

                <Link
                  href="/editpost"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-center"
                >
                  Manage Posts
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="mt-3 text-gray-600">{user.userEmail}</p>

              <Link
                href="/edituserprofile"
                className="block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-center"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthorProtectedRoute>
  );
}
