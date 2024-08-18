"use client";

import { ExtendedUser } from "@/types/interface";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import Loader from "./Loader";
import ChatBox from "./ChatBox";
import toast from "react-hot-toast";
import { getAllChats } from "@/lib/actions/chat.action";
import debounce from "debounce";

const ChatList = ({ currentChatId }: { currentChatId?: string | string[] }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<UserChats[]>([]);
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>("");

  const currentUser = session?.user as ExtendedUser;

  const getChats = async (query: string) => {
    try {
      const res = await getAllChats({ id: currentUser._id, query });
      setChats(res);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to Load Chats");
      console.log(error);
    }
  };

  // Use useCallback to prevent unnecessary re-creations of the debounced function
  const debouncedFetchContacts = useCallback(debounce(getChats, 300), [
    currentUser,
  ]);

  useEffect(() => {
    if (currentUser) {
      debouncedFetchContacts(search);
    }
  }, [currentUser, search, debouncedFetchContacts]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats gap-3">
        {chats.map((chat: UserChats) => (
          <ChatBox
            currentChatId={currentChatId!}
            chat={chat}
            key={chat._id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
