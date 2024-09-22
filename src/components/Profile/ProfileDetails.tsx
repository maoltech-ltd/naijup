"use client";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import AuthModal from "../Auth/AuthModal";
import moment from "moment";
import Link from "next/link";
import { BackIcon } from "../icon";
import Image from "next/image"

const ProfileDetails = ({ user }: any) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <section className="md:w-[80%] m-auto md:pt-16 pt-12">
      <div className="bg-white p-4  md:rounded-md">
        <div className="flex items-center justify-between md:pl-4">
          {
            user.profilePicture == ""
            ? (
            <Avatar
              src={user.profilePicture}
              className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
              name={user.username}
            />
              
            ):(
              <Image
              src={user.profilePicture} 
              alt={user.username}
              width={20}
              height={20}
              className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
            />
            )
          }
          
          <div className="flex flex-col justify-end gap-4">
             
          <Button color="primary" radius="sm" as={Link} href="/edituserprofile">
            Edit Profile
          </Button>
            
          </div>
        </div>
        <div className="pt-4">
          <h1 className="lg:text-2xl md:text-xl text-lg md:font-bold font-medium">
            {user.firstName} {user.lastName}
          </h1>
          <p>
            {user.userName}
          </p>
          <p className="text-lg py-2">
          {user.bio && Array.isArray(user.bio) ? (
            user.bio.map((paragraph: string, index: number) => (
              <p key={index} className="text-lg py-2">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-lg py-2">{user.bio}</p>
          )}
          </p>
          <div className="flex gap-4 py-2">
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
                {/* {user.followingIDs.length} */}
                2
              </p>
              <p className=" text-default-500 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
               3 {/* {user.followerIDs.length} */}
              </p>
              <p className="text-default-500 text-small">Followers</p>
            </div>
          </div>
          <div className="text-small text-default-500 py-2 flex gap-3 items-center">
            <div>
            <BackIcon name="cake" />
            </div>
            <div>
              <span>
                joined on {moment(user.createdAt).format("LL")}
              </span>
            </div>
          </div>
        </div>
        
        {user.moreInfo ? null : (
          <Button
            variant="bordered"
            fullWidth
            radius="sm"
            size="lg"
            className="font-semibold mt-4 md:hidden text-neutral-600"
            // onClick={() => dispatch(setMoreInfo(true))}
          >
            {user.username}
          </Button>
         )} 
      </div>

      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
};

export default ProfileDetails;
