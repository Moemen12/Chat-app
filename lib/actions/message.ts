"use server";

import { connectToDB } from "../mongodb";
import Chat from "../mongodb/models/Chat";
import Message from "../mongodb/models/Message";
import { pusherServer } from "../pusher";
import { handleError } from "../utils";

export const sendMessage = async ({
  chatId,
  currentUserId,
  text,
  photo,
}: MessageProps) => {
  try {
    await connectToDB();

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUserId,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: {
          lastMessageAt: newMessage.createdAt,
        },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: "User",
        },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    // Populate the sender for the new message
    await newMessage.populate("sender seenBy");

    await pusherServer.trigger(chatId, "new-message", newMessage);

    const lastMessage = updatedChat?.messages[updatedChat.messages.length - 1];
    updatedChat?.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: lastMessage,
        });
      } catch (error) {
        console.log(error);
      }
    });

    return JSON.parse(
      JSON.stringify({
        updatedChat,
        newMessage,
      })
    );
  } catch (error) {
    handleError(error);
  }
};
