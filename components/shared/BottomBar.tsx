"use client";
import { ExtendedUser } from "@/types/interface";
import { Logout } from "@mui/icons-material";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const BottomBar = () => {
  const { data: session } = useSession();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const user = session?.user as ExtendedUser;

  const pathname = usePathname();
  return (
    <div className="bottom-bar">
      <Link
        href={"/chats"}
        className={`${clsx(
          "text-red-1",
          pathname === "/chats"
        )} text-heading4-bold`}
      >
        Chats
      </Link>
      <Link
        href={"/contacts"}
        className={`${clsx(
          "text-red-1",
          pathname === "/contacts"
        )} text-heading4-bold`}
      >
        Contacts
      </Link>

      <Logout
        sx={{ color: "#737373", cursor: "pointer" }}
        onClick={handleLogout}
      />

      <Link href={"/profile"} className="rounded-full w-10 h-10">
        <Image
          src={user?.profileImage || "/assets/person.jpg"}
          alt="profile photo"
          width={40}
          height={40}
          className="size-full rounded-full object-cover"
          priority
        />
      </Link>
    </div>
  );
};

export default BottomBar;
