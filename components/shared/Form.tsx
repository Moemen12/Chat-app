"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/assets/logo.png";
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerUser } from "@/lib/actions/user.action";
import { IUser } from "@/lib/mongodb/models/User";
import { signIn } from "next-auth/react";

const Form = ({ type }: LoginType) => {
  const [loading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterParams>();

  const router = useRouter();
  const onSubmit: SubmitHandler<RegisterParams> = async ({
    email,
    username,
    password,
  }: RegisterParams) => {
    if (type === "register") {
      setIsLoading(true);

      await registerUser({ email, password, username })
        .then((res: IUser) => {
          router.push("/");
          return null;
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
          return error;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (type === "login") {
      try {
        setIsLoading(true);
        const res = await signIn("credentials", {
          ...{ email, password },
          redirect: false,
        });

        if (res?.error) {
          toast.error(res.error);
          return null;
        }

        router.push("/chats");
      } catch (error) {
        setIsLoading(false);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="auth">
      <div className="content">
        <Image priority src={logo} alt="logo" className="logo" />
        <form action="" className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue={""}
                  {...register("username", {
                    required: "Username is required",
                    validate: (value: string) => {
                      if (value.length < 3) {
                        return "Username must be at least 3 characters and contain at least one special character";
                      }
                    },
                  })}
                  autoComplete="username"
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500 max-w-96">
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="input">
              <input
                defaultValue={""}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                placeholder="Email"
                className="input-field"
                autoComplete="email"
              />

              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500 max-w-96">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="input">
              <input
                defaultValue={""}
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "password is required",
                  validate: (value: string) => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "Password must be at least 3 characters and contain at least one special character";
                    }
                  },
                })}
                className="input-field"
                autoComplete="new-password"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500 max-w-96">{errors.password.message}</p>
            )}
          </div>
          <button className="button" type="submit" disabled={loading}>
            {type === "register"
              ? loading
                ? "Signing up..."
                : "Join Free"
              : loading
              ? "Logging..."
              : "Let's Chat"}
          </button>
        </form>

        {type === "register" ? (
          <Link href={"/"} className="link">
            <p className="text-center">Already have an account? Sign In Here</p>
          </Link>
        ) : (
          <Link href={"/register"} className="link">
            <p className="text-center">
              Don&apos;t have an account? Register Here
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
