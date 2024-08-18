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
  return message.sender._id !== currentUser ? (
    <div className="message-box justify-end">
      <Image
        src={message.sender.profileImage || person}
        alt="profile-photo"
        className="message-profilePhoto"
        width={32}
        height={32}
      />
      <div className="message-info">
        <p className="text-sm font-bold">
          {message.sender.username} &#160; &#183; &#160;{" "}
          {formatDate(new Date(message.createdAt), "p")}
        </p>
        {message.text ? (
          <p className="message-text">{message.text}</p>
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
  ) : (
    <div className="message-box">
      <div className="message-info items-end">
        <p className="text-sm font-bold">
          {formatDate(new Date(message.createdAt), "p")}
        </p>
        {message.text ? (
          <p className="message-text-sender">{message.text}</p>
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
