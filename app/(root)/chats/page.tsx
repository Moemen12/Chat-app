"use client";
import ChatList from "@/components/shared/ChatList";
import Contact from "@/components/shared/Contact";
import { useSession } from "next-auth/react";
import React from "react";

const Chats = () => {
  const { data: session } = useSession();

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList />
      </div>

      <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
        <Contact />
      </div>
    </div>
  );
};

export default Chats;
