type LoginType = {
  type: "login" | "register";
};

type RegisterParams = {
  username: string;
  email: string;
  password: string;
};

type UpdateUser = {
  username: string;
  profileImage: File | string;
  id: string;
};

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl?: string;
  setFiles?: Dispatch<SetStateAction<File[]>>;
};

type User = {
  _id: string;
  email: string;
  username: string;
  password: string;
  profileImage?: string;
  __v: number;
};

type NewChatProps = {
  _id?: string;
  currentUserId: string;
  members: string[];
  isGroup: boolean;
  name: string;
  groupPhoto?: string;
};

type Chat = {
  chats: string[];
  email: string;
  password: string;
  profileImage: string;
  username: string;
  __v: number;
  _id: string;
};

type UserChats = {
  _id: string;
  createdAt: string;
  photo: string;
  groupPhoto: string;
  isGroup: boolean;
  lastMessageAt: string;
  members: Chat[];
  messages: Message[];
  name: string;
  _v: number;
};

type ChatSearchProps = {
  id: string;
  query: string;
};

type MessageProps = {
  chatId: string | string[];
  currentUserId: string;
  text?: string;
  photo?: string;
};

type Message = {
  chat: string;
  createdAt: string | Date;
  photo: string;
  seenBy: Array<Record<string, unknown>>;
  sender: {
    chats: string[];
    email: string;
    password: string;
    profileImage: string;
    username: string;
    __v: number;
    _id: string;
  };
  text: string;
  __v: number;
  _id: string;
};

type Messages = {
  messages: Message[];
};

type UpdateGroupInfo = {
  chatId: string | string[];
  name: string;
  groupPhoto: string | File;
};

type Member = {
  _id: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  chats: string[];
  __v: number;
};

type GroupInfoParams = {
  _id: string;
  createdAt: string; // or Date if you prefer
  groupPhoto: string;
  isGroup: boolean;
  lastMessageAt: string; // or Date if you prefer
  members: Member[];
  messages: Message[];
  name: string;
  __v: number;
};
