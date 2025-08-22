"use client";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { updateUserProfile } from "@/src/redux/slice/userSlice";
import { Button } from "@headlessui/react";
import { createImage } from "@/src/redux/slice/ImageSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EditProfile = ({ user }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.userName,
    bio: user.bio,
    profilePicture: user.profilePicture,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(user.profilePicture);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "bio") {
      setFormData({ ...formData, bio: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let profilePictureUrl = formData.profilePicture;

    if (imageFile) {
      const resultAction = await dispatch(createImage(imageFile as File));
      if (createImage.fulfilled.match(resultAction)) {
        profilePictureUrl = resultAction.payload.url; 
      } else {
        console.error("Image upload failed:", resultAction.payload || "Unknown error");
        return;
      }
    }

    const bioArray = formData.bio.split("\n");

    const updateResult = await dispatch(
      updateUserProfile({
        data: { ...formData, bio: bioArray, profilePicture: profilePictureUrl },
        token: user.token,
      })
    );

    if (updateUserProfile.fulfilled.match(updateResult)) {
      router.push("/userprofile");
    } else {
      console.error("Profile update failed:", updateResult.payload || "Unknown error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        {/* Display current or newly selected profile picture */}
        <div className="mb-4">
          {previewImage && (
            <Image
              src={previewImage}
              alt="Profile Picture Preview"
              className="w-24 h-24 rounded-full mx-auto mb-4"
              width = {100}
              height= {100}
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePictureFile">
            Upload New Profile Picture
          </label>
          <input
            type="file"
            id="profilePictureFile"
            name="profilePictureFile"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
