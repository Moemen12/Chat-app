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
  _id: string;
  chats: string[];
  email: string;
  password: string;
  profileImage: string;
  username: string;
  __v: number;
};

type UserChats = {
  _id: string;
  createdAt: string;
  groupPhoto: string;
  isGroup: boolean;
  lastMessageAt: string;
  members: Chat[];
  messages: string[];
  name: string;
  _v: number;
};
