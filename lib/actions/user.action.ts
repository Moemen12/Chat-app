"use server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { handleError } from "../utils";

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
