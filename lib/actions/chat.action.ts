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
    } else {
      throw new Error("You have already a chat with this user");
    }

    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    handleError(error);
  }
};
