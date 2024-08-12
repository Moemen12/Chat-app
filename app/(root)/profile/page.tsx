"use client";
import { Person2Outlined } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UploadButton } from "@/lib/uploadthing";
import Loader from "@/components/shared/Loader";
import { ExtendedUser } from "@/types/interface";

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        profileImage: user.profileImage,
      });
    }

    setLoading(false);
  }, [user]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUser>();

  const onSubmit: SubmitHandler<UpdateUser> = (data) => console.log(data);

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

        <div className="flex items-center justify-between">
          <Image
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            priority
            width={160}
            height={160}
            className="rounded-full"
          />
          {/* <p className="text-body-bold"> */}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(url) => {
              console.log(url?.[0].url);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
          {/* Upload new photo */}
          {/* </p> */}
        </div>
        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
