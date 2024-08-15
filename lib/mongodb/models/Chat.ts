import mongoose, { Model, Schema } from "mongoose";

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[]; // Array of User IDs
  messages: mongoose.Types.ObjectId[]; // Array of Message IDs
  isGroup: boolean; // Indicates if the chat is a group chat
  name: string; // Name of the group chat (if applicable)
  groupPhoto: string; // URL or path to the group photo
  createdAt: Date; // Timestamp for when the chat was created
  lastMessageAt: Date; // Timestamp for the last message sent in the chat
}

const ChatSchema = new mongoose.Schema<IChat>({
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  groupPhoto: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat: Model<IChat> =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
