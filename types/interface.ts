import { User as NextAuthUser } from "next-auth";

export interface ExtendedUser extends NextAuthUser {
  profileImage?: string;
  username: string;
}
