// "use client";
// import { useEffect } from "react";
// import Image from "next/image";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { useSelector } from "react-redux";
// import { getUserById } from "@/src/redux/slice/secondUserSlice";
// interface AuthorSectionProps {
//   authorId: string;
// }

// const AuthorSection = ({ authorId }: AuthorSectionProps) => {
//   const dispatch = useAppDispatch();
//     const { userId, userName, profilePicture, bio, status, firstName, lastName } = useSelector((state: any) => state.secondUser);
//   useEffect(() => {
//     if (authorId) {
//       dispatch(getUserById(authorId));
//     }
//   }, [dispatch, authorId]);

//   if (status === "pending") {
//     return (
//       <div className="p-4 border rounded-lg bg-gray-100 dark:bg-dark animate-pulse">
//         <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
//         <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
//         <div className="h-3 bg-gray-300 rounded w-3/4"></div>
//       </div>
//     );
//   }

//   if (status === "rejected") {
//     return <div className="text-red-500">Error loading author info</div>;
//   }

//   if (!userId) return null;

//   return (
//     <section className="border-t mt-10 pt-8">
//       <h2 className="text-xl font-semibold mb-4">About the Author</h2>
//       <div className="flex items-center gap-4">
//         <Image
//           src={profilePicture || "/default-avatar.png"}
//           alt={userName}
//           width={64}
//           height={64}
//           className="rounded-full object-cover"
//         />
//         <div>
//           <h3 className="text-lg font-semibold">{userName}</h3>
//           {Array.isArray(bio) && bio.length > 0 ? (
//             <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
//               {bio.map((paragraph: string, index: number) => (
//                 <p key={index}>{paragraph}</p>
//               ))}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               No bio available
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default AuthorSection;

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
  const { userId, userName, profilePicture, bio, status, firstName, lastName } =
    useSelector((state: any) => state.secondUser);

  useEffect(() => {
    if (authorId) {
      dispatch(getUserById(authorId));
    }
  }, [dispatch, authorId]);

  if (status === "pending") {
    return (
      <div className="p-6 border rounded-2xl bg-gray-100 dark:bg-dark animate-pulse shadow-md">
        <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  if (status === "rejected") {
    return <div className="text-red-500">Error loading author info</div>;
  }

  if (!userId) return null;

  return (
    <section className="mt-16">
      <div className="p-6 border rounded-2xl bg-gray-50 dark:bg-dark/40 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-dark dark:text-light border-b pb-3">
          About the Author
        </h2>
        <div className="flex items-start gap-6">
          <Image
            src={profilePicture || "/default-avatar.png"}
            alt={userName}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-light">
              {firstName || lastName
                ? `${firstName} ${lastName}`
                : userName}
            </h3>
            {Array.isArray(bio) && bio.length > 0 ? (
              <div className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {bio.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                No bio available
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
