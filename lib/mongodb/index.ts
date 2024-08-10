import mongoose, { Connection } from "mongoose";

import cacheManager from "cache-manager";

const MONGO_URI = process.env.MONGO_URI;

// Connection Configuration

const mongooseOptions: mongoose.ConnectOptions = {
  dbName: "app-chat",
  maxPoolSize: 10,
};

let cachedConnection: Connection | null = null;

// Connection Function

export async function connectToDB(): Promise<Connection> {
  if (cachedConnection) {
    return cachedConnection; // Return the cached connection
  }
  try {
    const connection = await mongoose.connect(MONGO_URI!, mongooseOptions);
    cachedConnection = connection.connection;
    return cachedConnection;
  } catch (error) {
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI must be defined");
    }
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
