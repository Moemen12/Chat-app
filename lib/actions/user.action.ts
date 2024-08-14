"use server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { handleError } from "../utils";
import { UTApi } from "uploadthing/server";

const deleteFileFromUploadthing = async (fileUrl: string): Promise<boolean> => {
  try {
    await new UTApi().deleteFiles(fileUrl);
    return true;
  } catch (error) {
    return false;
  }
};

export const registerUser = async ({
  email,
  username,
  password,
}: RegisterParams) => {
  try {
    await connectToDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // return NextResponse.json(
      //   { error: "existsUser already " },
      //   { status: 400 }
      // );
      throw new Error("User already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    handleError(error);
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const updateUser = async ({
  id,
  username,
  profileImage,
}: UpdateUser) => {
  try {
    await connectToDB();

    const existingUser = await User.findById(id)
      .orFail(new Error("User Not Found"))
      .exec();

    existingUser.profileImage &&
      (await deleteFileFromUploadthing(
        existingUser.profileImage.split("https://utfs.io/f/")[1]
      ));

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        profileImage,
      },
      {
        new: true,
      }
    );

    return JSON.parse(JSON.stringify(updatedUser)); // Return the updated user object
  } catch (error) {
    handleError(error);
  }
};
