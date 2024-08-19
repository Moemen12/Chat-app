"use client";

import Loader from "@/components/shared/Loader";
import { getUserChat, updateGroupInfo } from "@/lib/actions/chat.action";
import { useUploadThing } from "@/lib/uploadthing";
import { convertFileToUrl } from "@/lib/utils";
import { ExtendedUser } from "@/types/interface";
// import Loader from "@components/Loader";
import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type UpdateUser = {
  id: string;
  username: string;
  profileImage?: string | File;
  groupPhoto: string;
  name: string;
};

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<GroupInfoParams | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { chatId } = useParams();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { data: session, update } = useSession();
  const user = session?.user as ExtendedUser;

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

  const getChatDetails = async () => {
    try {
      const data = await getUserChat(chatId);
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const preview = convertFileToUrl(selectedFile);
      setPreviewUrl(preview); // This sets the preview URL
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<UpdateUser>();

  const updateProfileInBackend = async (
    name: string,
    groupPhoto?: string | null
  ) => {
    try {
      // If imageUrl is undefined or null, fall back to the user's existing profile image
      const profileImage: string = groupPhoto ? groupPhoto : "";

      await updateGroupInfo({
        chatId,
        name,
        groupPhoto: profileImage, // This ensures profileImage is either a string or a File
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
    let imageUrl: string | null = user?.profileImage || ""; // Default to current profile image or null

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

    await updateProfileInBackend(data.name, imageUrl);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page px-4">
      <h1 className="text-heading3-bold">Edit Group Info</h1>

      <form className="edit-profile" onSubmit={handleSubmit(onSubmit)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group chat name is required",
            })}
            type="text"
            placeholder="Group chat name"
            className="input-field"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <div className="flex items-center gap-2 justify-center">
          <Image
            priority
            src={previewUrl || watch("groupPhoto") || "/assets/group.png"}
            width={160}
            height={160}
            alt="profile"
            className="w-40 h-40 rounded-full"
          />

          <div onClick={handleDivClick} className="cursor-pointer">
            Upload new photo
            <input
              {...register("groupPhoto")}
              className="hidden"
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {chat &&
            chat.members &&
            chat.members.map((member, index) => (
              <p className="selected-contact" key={index}>
                {member.username}
              </p>
            ))}
        </div>

        <button className="btn" type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default GroupInfo;
