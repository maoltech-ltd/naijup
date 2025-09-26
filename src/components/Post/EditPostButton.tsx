
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import Link from "next/link";

interface EditPostButtonProps {
  slug: string;
  authorId: string;
}

export default function EditPostButton({ slug, authorId }: EditPostButtonProps) {
  const user = useSelector((state: RootState) => state.user);

  if (!user?.userId || user.userId !== authorId) return null;

  return (
    <div className="flex justify-end px-5 md:px-10 mt-4">
      <Link
        href={`/editpost/${slug}`}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Edit Post
      </Link>
    </div>
  );
}
