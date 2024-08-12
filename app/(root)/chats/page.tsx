"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Chats = () => {
  const { data: session } = useSession();

  return <div>Chats</div>;
};

export default Chats;
