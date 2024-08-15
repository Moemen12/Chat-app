"use client";
import { getAllUsers } from "@/lib/actions/user.action";
import { ExtendedUser } from "@/types/interface";
import { RadioButtonChecked } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import person from "@/public/assets/person.jpg";

const Contact: React.FC = (): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<User[]>([]);
  const { data: session } = useSession();
  const currentUser = session?.user as ExtendedUser;

  const fetchUsers = async (): Promise<User[] | void> => {
    try {
      const users: User[] = await getAllUsers();
      console.log(users); // Log the users to the console

      const filteredContacts = users.filter(
        (contact: User) => contact._id !== currentUser._id
      );
      setContacts(filteredContacts);

      return filteredContacts; // Return the filtered contacts
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return an empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchUsers();
  }, [currentUser]);

  return (
    <div className="create-chat-container">
      <input placeholder="Search contact..." className="input-search" />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="font-bold">Select or Deselect</p>

          {contacts.map((contact: User) => (
            <div key={contact._id} className="contact">
              <RadioButtonChecked />
              <Image
                width={40}
                height={40}
                src={contact.profileImage || person}
                alt="profile"
                className="profilePhoto"
              />
              <p className="font-bold text-base">{contact.username}</p>
            </div>
          ))}
        </div>

        <div className="create-chat">
          <button className="btn uppercase">start a new chat</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
