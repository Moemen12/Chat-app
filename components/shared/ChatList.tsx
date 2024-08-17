"use client";
import { getAllChats } from "@/lib/actions/user.action";
import { ExtendedUser } from "@/types/interface";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import ChatBox from "./ChatBox";

const ChatList = () => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();

  const currentUser = session?.user as ExtendedUser;

  const getChats = async () => {
    try {
      const res = await getAllChats(currentUser._id);

      setChats(res);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser]);
  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input placeholder="Search chat..." className="input-search" />

      <div className="chats">
        {chats.map((chat: UserChats) => (
          <ChatBox
            chat={chat}
            key={chat._id}
            index={chat._id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
