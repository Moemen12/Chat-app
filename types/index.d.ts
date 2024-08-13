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
  profileImage: File;
};

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl?: string;
  setFiles?: Dispatch<SetStateAction<File[]>>;
};
