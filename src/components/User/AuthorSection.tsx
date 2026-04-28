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

  const {
    userId,
    userName,
    profilePicture,
    bio,
    status,
  } = useSelector((state: any) => state.secondUser);

  useEffect(() => {
    if (authorId) {
      dispatch(getUserById(authorId));
    }
  }, [dispatch, authorId]);

  if (status === "pending") {
    return (
      <div className="mt-16 animate-pulse">
        <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-neutral-900 rounded-2xl shadow p-6 md:p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 dark:bg-neutral-700 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-neutral-700 w-1/3 mx-auto rounded mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-neutral-700 w-2/3 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <p className="text-center text-red-400 mt-10">
        Failed to load author information.
      </p>
    );
  }

  if (!userId) return null;

  return (
    <section className="mt-20 px-4">
      <div
        className="
          max-w-4xl mx-auto 
          bg-white dark:bg-neutral-900
          rounded-2xl 
          shadow-lg dark:shadow-black/40
          p-6 md:p-10
          transition-all
        "
      >
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-900 dark:text-light mb-6">
          About the Author
        </h2>

        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
            <Image
              src={profilePicture || "/default-avatar.png"}
              alt={userName}
              fill
              quality={80}
              className="rounded-full object-cover shadow-md ring-2 ring-gray-200 dark:ring-neutral-700"
            />
          </div>

          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-light">
            {userName}
          </h3>

          <div
            className="
              mt-4 
              max-w-2xl 
              text-sm md:text-base 
              leading-relaxed 
              space-y-2
              text-gray-700 dark:text-light
            "
          >
            {Array.isArray(bio) && bio.length > 0 ? (
              bio.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No bio available</p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
