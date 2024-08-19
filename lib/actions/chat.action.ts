"use server";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongodb";
import Chat from "../mongodb/models/Chat";
import Message from "../mongodb/models/Message";
import User from "../mongodb/models/User";
import { deleteFileFromUploadthing, handleError } from "../utils";
import { pusherServer } from "../pusher";

export const createChat = async ({
  currentUserId,
  members,
  isGroup,
  name,
  groupPhoto,
}: NewChatProps) => {
  try {
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : {
          members: {
            $all: [currentUserId, ...members],
            $size: 2,
          },
        };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await Chat.create(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
      const updateAllMembers = chat.members.map(
        async (memberId) =>
          await User.findByIdAndUpdate(
            memberId,
            {
              $addToSet: { chats: chat?._id },
            },
            {
              new: true,
            }
          )
      );
      Promise.all(updateAllMembers);

      chat.members.map((member) => {
        pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    } else {
      throw new Error("You have already a chat with this user");
    }

    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    handleError(error);
  }
};

export const getAllChats = async ({ query, id }: ChatSearchProps) => {
  try {
    await connectToDB();

    let chats;
    if (query) {
      // Search for chats based on the query
      chats = await Chat.find({
        members: id,
        name: {
          $regex: query,
          $options: "i",
        },
      })
        .populate({
          path: "members",
          model: User,
        })
        .populate({
          path: "messages",
          model: Message,
          populate: {
            path: "sender seenBy",
            model: User,
          },
        })
        .exec();
    } else {
      // Get all chats
      chats = await Chat.find({ members: id })
        .sort({ lastMessageAt: -1 })
        .populate({
          path: "members",
          model: User,
        })
        .populate({
          path: "messages",
          model: Message,
          populate: {
            path: "sender seenBy",
            model: User,
          },
        })
        .exec();
    }

    return JSON.parse(JSON.stringify(chats));
  } catch (error) {
    handleError(error);
  }
};

export const getUserChat = async (chatId: string | string[]) => {
  try {
    await connectToDB();

    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    handleError(error);
  }
};

export const updateGroupInfo = async ({
  chatId,
  name,
  groupPhoto,
}: UpdateGroupInfo) => {
  try {
    await connectToDB();

    const existingChat = await Chat.findById(chatId).orFail(
      new Error("Chat not found")
    );

    if (existingChat.groupPhoto && groupPhoto) {
      const fileIdentifier =
        existingChat.groupPhoto.split("https://utfs.io/f/")[1];

      await deleteFileFromUploadthing(fileIdentifier);
    }

    // Update the group info
    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedGroupChat));
  } catch (error) {
    handleError(error);
  }
};
