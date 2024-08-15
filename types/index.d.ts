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
