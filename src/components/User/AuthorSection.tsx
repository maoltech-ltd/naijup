"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { getUserById } from "@/src/redux/slice/secondUserSlice";
interface AuthorSectionProps {
  authorId: string;
}

const AuthorSection = ({ authorId }: AuthorSectionProps) => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useSelector((state: any) => state.secondUser);
  console.log("AuthorSection user:", user);

  useEffect(() => {
    if (authorId) {
      dispatch(getUserById(authorId));
    }
  }, [dispatch, authorId]);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-100 dark:bg-dark animate-pulse">
        <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading author info</div>;
  }

  if (!user) return null;

  return (
    <section className="border-t mt-10 pt-8">
      <h2 className="text-xl font-semibold mb-4">About the Author</h2>
      <div className="flex items-center gap-4">
        <Image
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.userName}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{user.userName}</h3>
          {Array.isArray(user.bio) && user.bio.length > 0 ? (
            <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {user.bio.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No bio available
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthorSection;