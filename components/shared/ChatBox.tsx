import Image from "next/image";
import React from "react";
import groupPhoto from "@/public/assets/group.png";
import person from "@/public/assets/person.jpg";
import { ExtendedUser } from "@/types/interface";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const ChatBox = ({
  chat,
  currentUser,
  currentChatId,
}: {
  chat: UserChats;
  currentUser: ExtendedUser;
  currentChatId: string | string[];
}) => {
  const router = useRouter();
  const otherMembers = chat.members.filter(
    (member) => member._id !== currentUser._id
  );

  const lastMessage =
    chat.messages.length > 0 && chat.messages[chat.messages.length - 1];

  console.log(lastMessage);

  // const seen = lastMessage?.seenBy?.find(
  //   (member) => member._id === currentUser._id
  // );

  return (
    <div
      className={clsx("chat-box", { "bg-blue-2": chat._id === currentChatId })}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      <div className="chat-info">
        {chat.isGroup ? (
          <Image
            src={chat.groupPhoto || groupPhoto}
            alt="group-photo"
            className="w-11 h-11"
            width={44}
            height={44}
          />
        ) : (
          <Image
            src={otherMembers[0].profileImage || person}
            alt="profile-photo"
            className="profilePhoto"
            width={44}
            height={44}
          />
        )}

        <div className="flex flex-col gap-1">
          {chat.isGroup ? (
            <p className="text-base font-bold">{chat.name}</p>
          ) : (
            <p className="font-bold text-base">{otherMembers[0].username}</p>
          )}
          {!lastMessage && (
            <p className="text-small font-bold">Started a Chat</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-base font-light text-grey-3">
          {!lastMessage && format(new Date(chat.createdAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
