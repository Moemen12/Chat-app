import Image from "next/image";
import person from "@/public/assets/person.jpg";
import { formatDate } from "date-fns";

const MessageBox = ({
  message,
  currentUser,
}: {
  message: Message;
  currentUser: string;
}) => {
  const isSentByCurrentUser = message.sender?._id === currentUser;

  return (
    <div className={`message-box ${isSentByCurrentUser ? "" : "justify-end"}`}>
      {!isSentByCurrentUser && (
        <Image
          src={message.sender?.profileImage || person}
          alt="profile-photo"
          className="message-profilePhoto"
          width={32}
          height={32}
        />
      )}
      <div className={`message-info ${isSentByCurrentUser ? "items-end" : ""}`}>
        <p className="text-sm font-bold">
          {message.sender?.username || "Unknown"} &#160; &#183; &#160;{" "}
          {formatDate(new Date(message.createdAt), "p")}
        </p>
        {message.text ? (
          <p className={`message-text${isSentByCurrentUser ? "-sender" : ""}`}>
            {message.text}
          </p>
        ) : (
          <Image
            src={message.photo}
            alt="message"
            className="message-photo"
            width={160}
            height={100}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
