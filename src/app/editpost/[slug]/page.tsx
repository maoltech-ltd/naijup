"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchPostByTitle } from "@/src/redux/slice/postSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import Editor from "@/src/components/Post/Editor";
import LoadingSpinner from "@/src/components/loading/loadingSpinner";

const EditPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dispatch(fetchPostByTitle(slug))
      .unwrap()
      .then((res) => setPost(res))
      .finally(() => setLoading(false));
  }, [slug, dispatch]);

  if (loading) return <LoadingSpinner />;

  if (!post) return <div className="text-center py-10">Post not found</div>;

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
      {({ user }: { user: { userId: string } }) => (
        <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
          <Editor post={post} user={user} />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default EditPostPage;
