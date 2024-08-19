"use client";

import { getUserChat } from "@/lib/actions/chat.action";
import { ExtendedUser } from "@/types/interface";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import groupPhoto from "@/public/assets/group.png";
import person from "@/public/assets/person.jpg";
import send from "@/public/assets/send.jpg";
import Image from "next/image";
import { AddPhotoAlternate } from "@mui/icons-material";
import { sendMessage } from "@/lib/actions/message.action";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

const ChatDetails = ({ chatId }: { chatId: string[] | string }) => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<UserChats | null>(null);
  const [otherMembers, setOtherMembers] = useState<Chat[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const [text, setText] = useState<string>("");
  const currentUser = session?.user as ExtendedUser;

  const { startUpload } = useUploadThing("sendChatImage", {
    onUploadError(e) {
      if (e.message === "Invalid config: FileSizeMismatch") {
        toast.error("Image size must be less than 4MB");
      }
      if (e.message === "Only JPEG and PNG images are allowed") {
        toast.error("Only JPEG and PNG images are allowed");
      }
    },
  });

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

  const handleMessage = async (newMessage: any) => {
    setChat((prevChat: any) => {
      return {
        ...prevChat,
        messages: [...prevChat?.messages, newMessage],
      };
    });
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  useEffect(() => {
    pusherClient.subscribe(chatId as string);
    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId as string);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  const bottomRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    bottomRef &&
      bottomRef.current &&
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [chat?.messages]);

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sendText = async () => {
    try {
      let imageUrl: null | string = "";

      // If there is an image file, start the upload process
      if (file) {
        const uploadResponse = await startUpload([file]);

        // Extract the image URL from the upload response
        imageUrl =
          uploadResponse && uploadResponse[0]?.url
            ? uploadResponse[0].url
            : null;

        // If the image upload fails, stop the function execution
        if (!imageUrl) {
          throw new Error("Image upload failed.");
        }
      }

      // Send the message with or without the image URL
      const res = await sendMessage({
        chatId,
        currentUserId: currentUser._id,
        text,
        photo: imageUrl || "",
      });

      setText("");
      setImageFile(null);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="pb-20">
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

        <div className="chat-body">
          {chat?.messages.map((message: Message) => (
            <MessageBox
              key={message._id}
              message={message}
              currentUser={currentUser._id}
            />
          ))}
          <div ref={bottomRef}></div>
        </div>
        <div className="send-message">
          <div className="prepare-message">
            <input
              type="file"
              accept="image/jpeg,image/png"
              name="image"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <AddPhotoAlternate
              onClick={selectImage}
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
            <Image src={send} alt="send" className="send-icon bg-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
