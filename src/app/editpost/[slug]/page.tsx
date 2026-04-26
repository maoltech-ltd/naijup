"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchPostBySlug } from "@/src/redux/slice/postSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import Editor from "@/src/components/Post/Editor";
import LoadingSpinner from "@/src/components/loading/loadingSpinner";
import { UserState } from "@/src/redux/slice/userSlice";

const EditPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  const { post, status, error } = useSelector((state: RootState) => state.post);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
  }, [slug, dispatch]);

  if (status === "idle") return <LoadingSpinner />;

  if (status === "failed") {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  // ✅ Ensure only the author can edit
  if (user.userId !== post.author) {
    return (
      <div className="text-center py-10 text-red-500">
        You are not authorized to edit this post.
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {({ user }: { user: UserState }) => (
        <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
          <Editor post={post} user={user} />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default EditPostPage;
