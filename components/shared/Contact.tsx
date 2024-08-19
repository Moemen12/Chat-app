"use client";
import debounce from "debounce";
import { getAllUsersOrSearchContacts } from "@/lib/actions/user.action";
import { ExtendedUser } from "@/types/interface";
import {
  CheckCircle,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import person from "@/public/assets/person.jpg";
import { createChat } from "@/lib/actions/chat.action";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Contact: React.FC = (): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const { data: session } = useSession();
  const currentUser = session?.user as ExtendedUser;

  const fetchContacts = async (query: string): Promise<User[] | void> => {
    try {
      const users: User[] = await getAllUsersOrSearchContacts(query);

      // Check if currentUser and currentUser._id are defined
      if (currentUser?._id) {
        const filteredContacts = users.filter(
          (contact: User) => contact._id !== currentUser._id
        );
        setContacts(filteredContacts);
        return filteredContacts; // Return the filtered contacts
      } else {
        setContacts(users);
        return users; // Return the unfiltered users if currentUser._id is not defined
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return an empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback to prevent unnecessary re-creations of the debounced function
  const debouncedFetchContacts = useCallback(debounce(fetchContacts, 300), [
    currentUser,
  ]);

  useEffect(() => {
    if (currentUser) debouncedFetchContacts(search);
  }, [currentUser, search, debouncedFetchContacts]);

  const [selectedContacts, setSelectedContacts] = useState<User[]>([]);

  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact: any) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  const router = useRouter();
  const [name, setName] = useState<string>("");

  const createNewChat = async () => {
    try {
      setSubmitLoading(true);
      const chat: NewChatProps = await createChat({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      });

      if (chat) {
        router.push(`/chats/${chat._id}`);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="create-chat-container">
      <input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list !mb-6">
          <p className="font-bold">Select or Deselect</p>

          {contacts.map((contact: User) => (
            <div
              key={contact._id}
              className="contact"
              onClick={() => handleSelect(contact)}
            >
              {selectedContacts.find((item) => item === contact) ? (
                <CheckCircle style={{ color: "red" }} />
              ) : (
                <RadioButtonUnchecked />
              )}

              <Image
                width={40}
                height={40}
                src={contact.profileImage || person}
                alt="profile"
                className="profilePhoto"
              />
              <p className="font-bold text-base line-clamp-3">
                {contact.username}
              </p>
            </div>
          ))}
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="font-bold">Group Chat Name</p>
                <input
                  type="text"
                  placeholder="Enter group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact: User) => (
                    <p className="selected-contact" key={contact._id}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="btn uppercase"
            disabled={submitLoading}
            onClick={createNewChat}
          >
            {submitLoading ? "new chat is creating..." : "start a new chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
