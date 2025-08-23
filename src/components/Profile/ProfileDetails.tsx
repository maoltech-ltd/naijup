// "use client";
// import { Avatar, Button, useDisclosure } from "@nextui-org/react";
// import React from "react";
// import AuthModal from "../Auth/AuthModal";
// import moment from "moment";
// import Link from "next/link";
// import { BackIcon } from "../icon";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { logoutUser } from "@/src/redux/slice/userSlice";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";

// const ProfileDetails = ({ user }: any) => {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const handleLogout = () => {
//     dispatch(logoutUser());
//     // You might want to redirect to home page after logout
//     router.push("/");
//   };
//   return (
//     <section className="md:w-[80%] m-auto md:pt-16 pt-12">
//       <div className="bg-white p-4  md:rounded-md">
//         <div className="flex items-center justify-between md:pl-4">
//           {user.profilePicture == "" ? (
//             <Avatar
//               src={user.profilePicture}
//               className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
//               name={user.username}
//             />
//           ) : (
//             <Image
//               src={user.profilePicture}
//               alt={user.username}
//               width={20}
//               height={20}
//               className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
//             />
//           )}

//           <div className="flex flex-col justify-end gap-4">
//             <Button
//               color="primary"
//               radius="sm"
//               as={Link}
//               href="/edituserprofile"
//             >
//               Edit Profile
//             </Button>

//             <Button
//               color="danger"
//               radius="sm"
//               variant="flat"
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           </div>
//         </div>
//         <div className="pt-4">
//           <h1 className="lg:text-2xl md:text-xl text-lg md:font-bold font-medium">
//             {user.firstName} {user.lastName}
//           </h1>
//           <p>{user.userName}</p>
//           <p className="text-lg py-2">
//             {user.bio && Array.isArray(user.bio) ? (
//               user.bio.map((paragraph: string, index: number) => (
//                 <p key={index} className="text-lg py-2">
//                   {paragraph}
//                 </p>
//               ))
//             ) : (
//               <p className="text-lg py-2">{user.bio}</p>
//             )}
//           </p>
//           <div className="flex gap-4 py-2">
//             <div className="flex gap-1">
//               <p className="font-semibold text-default-500 text-small">
//                 {/* {user.followingIDs.length} */}2
//               </p>
//               <p className=" text-default-500 text-small">Following</p>
//             </div>
//             <div className="flex gap-1">
//               <p className="font-semibold text-default-500 text-small">
//                 3 {/* {user.followerIDs.length} */}
//               </p>
//               <p className="text-default-500 text-small">Followers</p>
//             </div>
//           </div>
//           <div className="text-small text-default-500 py-2 flex gap-3 items-center">
//             <div>
//               <BackIcon name="cake" />
//             </div>
//             <div>
//               <span>joined on {moment(user.createdAt).format("LL")}</span>
//             </div>
//           </div>
//         </div>

//         {user.moreInfo ? null : (
//           <Button
//             variant="bordered"
//             fullWidth
//             radius="sm"
//             size="lg"
//             className="font-semibold mt-4 md:hidden text-neutral-600"
//             // onClick={() => dispatch(setMoreInfo(true))}
//           >
//             {user.username}
//           </Button>
//         )}
//       </div>

//       <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
//     </section>
//   );
// };

// export default ProfileDetails;
"use client";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import AuthModal from "../Auth/AuthModal";
import moment from "moment";
import Link from "next/link";
import { BackIcon } from "../icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/src/redux/slice/userSlice";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";

const ProfileDetails = ({ user }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {user.profilePicture == "" ? (
              <Avatar
                src={user.profilePicture}
                className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg"
                name={user.username}
              />
            ) : (
              <div className="relative h-24 w-24 md:h-32 md:w-32">
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">@{user.userName}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              color="primary"
              radius="full"
              className="font-medium px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600"
              as={Link}
              href="/edituserprofile"
            >
              Edit Profile
            </Button>

            <Button
              color="danger"
              radius="full"
              variant="flat"
              className="font-medium px-6 py-3 border border-red-200"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            {user.bio && Array.isArray(user.bio) ? (
              user.bio.map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-2 last:mb-0"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">2</p>
            <p className="text-sm text-blue-800">Following</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-green-800">Followers</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-sm text-purple-800">Posts</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
            <p className="text-2xl font-bold text-orange-600">24</p>
            <p className="text-sm text-orange-800">Likes</p>
          </div>
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <BackIcon name="cake" className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Member since</p>
            <p className="font-medium text-gray-900">
              {moment(user.createdAt).format("MMMM Do, YYYY")}
            </p>
          </div>
        </div>

        {/* Mobile Only Button */}
        {user.moreInfo ? null : (
          <Button
            variant="bordered"
            fullWidth
            radius="full"
            size="lg"
            className="font-semibold mt-6 md:hidden text-gray-700 border-gray-300"
          >
            View {user.username}&apos;s Activity
          </Button>
        )}
      </div>

      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
};

export default ProfileDetails;
