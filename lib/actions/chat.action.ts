"use server";
import Chat from "../mongodb/models/Chat";
import User from "../mongodb/models/User";
import { handleError } from "../utils";

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
      chat = new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
    }

    await chat.save();

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $addToSet: { chats: chat._id }, // Properly using $addToSet
      },
      {
        new: true,
      }
    );

    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    handleError(error);
  }
};
