"use server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { handleError } from "../utils";
import { UTApi } from "uploadthing/server";
import Chat from "../mongodb/models/Chat";

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

    if (existingUser.profileImage && profileImage) {
      await deleteFileFromUploadthing(
        existingUser.profileImage.split("https://utfs.io/f/")[1]
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        profileImage: profileImage || existingUser.profileImage, // Keep existing profile image if no new image
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

export const getAllUsersOrSearchContacts = async (query: string) => {
  try {
    await connectToDB();

    const searchCondition = query
      ? {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchCondition).exec();
    return JSON.parse(JSON.stringify(users)); // Return the list of users or searched contacts
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

export const getAllChats = async (id: string) => {
  try {
    await connectToDB();

    const allChats = await Chat.find({ members: id })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return JSON.parse(JSON.stringify(allChats));
  } catch (error) {
    handleError(error);
  }
};
