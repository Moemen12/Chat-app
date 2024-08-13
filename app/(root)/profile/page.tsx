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
import Image from "next/image"; // Import the Image component
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const { data: session } = useSession();
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUser>();

  const { startUpload } = useUploadThing("imageUploader");

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

  const onSubmit: SubmitHandler<UpdateUser> = async (data) => {
    if (file) {
      try {
        setIsUploading(true);
        const url = await startUpload([file]);

        if (!url) {
          throw new Error("Upload failed: No URL returned.");
        }
      } catch (error) {
        toast.error("Upload failed");
      } finally {
        setIsUploading(false);
      }
    }
    console.log("Form Data:", data);
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
          {/* Use the Image component to display the preview */}
          <Image
            src={
              previewUrl ||
              (user?.profileImage ? user.profileImage : person.src)
            }
            alt="Profile Image"
            width={160} // Adjust width
            height={160} // Adjust height
            className="rounded-full object-cover max-w-40 max-h-40"
            priority
          />

          <div onClick={handleDivClick} className="cursor-pointer">
            Upload new photo
            <input
              {...register("profileImage", { max: 1 })}
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
