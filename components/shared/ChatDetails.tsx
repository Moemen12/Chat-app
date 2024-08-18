"use client";

import { getUserChat } from "@/lib/actions/chat.action";
import { ExtendedUser } from "@/types/interface";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import groupPhoto from "@/public/assets/group.png";
import person from "@/public/assets/person.jpg";
import send from "@/public/assets/send.jpg";
import Image from "next/image";
import { AddPhotoAlternate } from "@mui/icons-material";
import { sendMessage } from "@/lib/actions/message";

const ChatDetails = ({ chatId }: { chatId: string[] | string }) => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<UserChats | null>(null);
  const [otherMembers, setOtherMembers] = useState<Chat[]>([]);
  const { data: session } = useSession();
  const [text, setText] = useState<string>("");
  const currentUser = session?.user as ExtendedUser;

  const getChatDetails = async () => {
    try {
      setLoading(true);
      const data: UserChats = await getUserChat(chatId);

      setChat(data);
      setOtherMembers(
        data.members.filter((member: Chat) => member._id !== currentUser._id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    try {
      const res = await sendMessage({
        chatId,
        currentUserId: currentUser._id,
        text,
      });

      console.log(res);

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        {chat?.isGroup ? (
          <Link href={`/chats/${chatId}/group-info`}>
            <Image
              width={44}
              height={44}
              src={chat.groupPhoto || groupPhoto}
              alt="group-photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>
                {chat.name} &#160; &#183; &#160; {chat.members.length} members
              </p>
            </div>
          </Link>
        ) : otherMembers.length > 0 ? (
          <>
            <Image
              width={44}
              height={44}
              src={otherMembers[0].profileImage || person}
              alt="profile photo"
              className="profilePhoto"
            />

            <div className="text">
              <p>{otherMembers[0].username}</p>
            </div>
          </>
        ) : (
          <div>No other members found</div> // Fallback UI if no members are found
        )}
      </div>

      <div className="chat-body"></div>
      <div className="send-message">
        <div className="prepare-message">
          <AddPhotoAlternate
            sx={{
              fontSize: "35px",
              color: "#737373",
              cursor: "pointer",
              "&:hover": { color: "red" },
            }}
          />
          <input
            type="text"
            placeholder="Write a message..."
            value={text}
            className="input-field"
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div onClick={sendText}>
          <Image src={send} alt="send" className="send-icon" />
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
