"use client";
import { Person2Outlined } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import Loader from "@/components/shared/Loader";
import { ExtendedUser } from "@/types/interface";
import { convertFileToUrl } from "@/lib/utils";
import person from "@/public/assets/person.jpg";
import Image from "next/image";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/actions/user.action";

type UpdateUser = {
  id: string;
  username: string;
  profileImage?: string | File;
};

const Profile: React.FC = () => {
  const { data: session, update } = useSession();
  const user = session?.user as ExtendedUser;

  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
      });
    }
    setLoading(false);
  }, [user]);

  const { register, handleSubmit, reset } = useForm<UpdateUser>();

  const { startUpload } = useUploadThing("updateProfile", {
    onUploadError(e) {
      if (e.message === "Invalid config: FileSizeMismatch") {
        toast.error("Image size must be less than 2MB");
      }
      if (e.message === "Only JPEG and PNG images are allowed") {
        toast.error("Only JPEG and PNG images are allowed");
      }
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const preview = convertFileToUrl(selectedFile);
      setPreviewUrl(preview);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const updateProfileInBackend = async (
    username: string,
    imageUrl?: string | null
  ) => {
    try {
      // If imageUrl is undefined or null, fall back to the user's existing profile image
      const profileImage: string | File = imageUrl ?? user.profileImage ?? "";

      await updateUser({
        id: user._id,
        username,
        profileImage, // This ensures profileImage is either a string or a File
      });

      toast.success("Profile updated successfully");

      // Refresh the session after updating the profile
      await update();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const onSubmit: SubmitHandler<UpdateUser> = async (data) => {
    let imageUrl: string | null = user?.profileImage || null; // Default to current profile image or null

    if (file) {
      try {
        setIsUploading(true);
        const uploadResponse = await startUpload([file]);

        imageUrl =
          uploadResponse && uploadResponse[0]?.url
            ? uploadResponse[0].url
            : null;
        setPreviewUrl(imageUrl || previewUrl);
      } finally {
        setIsUploading(false);
      }
    }

    await updateProfileInBackend(data.username, imageUrl);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="edit-profile" onSubmit={handleSubmit(onSubmit)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value: string) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <Person2Outlined sx={{ color: "#737373" }} />
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Image
            src={
              previewUrl ||
              (user?.profileImage ? user.profileImage : person.src)
            }
            alt="Profile Image"
            width={160}
            height={160}
            className="rounded-full object-cover max-w-40 max-h-40 w-40 h-40"
            priority
          />

          <div onClick={handleDivClick} className="cursor-pointer">
            Upload new photo
            <input
              {...register("profileImage")}
              className="hidden"
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <button className="btn" type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
