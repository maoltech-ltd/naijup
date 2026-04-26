
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import Link from "next/link";
import { Blog } from "@/src/app/blog/[slug]/BlogPage";
import { setPost } from "@/src/redux/slice/postSlice";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";

interface EditPostButtonProps {
  slug: string;
  blog: Blog;
}

export default function EditPostButton({ slug, blog }: EditPostButtonProps) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  if (!user?.userId || user.userId !== blog.author) return null;

  return (
    <div className="flex justify-end px-5 md:px-10 mt-4">
      <Link
        href={`/editpost/${slug}`}
        onClick={() =>
          dispatch(
            setPost({
              ...blog,
              createdAt: blog.publication_date,
              updatedAt: blog.updatedAt as string,
            })
          )
        }
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Edit Post
      </Link>
    </div>
  );
}
