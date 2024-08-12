import { connectToDB } from "@/lib/mongodb";
import User, { IUser } from "@/lib/mongodb/models/User"; // Assuming IUser is your User interface
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { User as NextAuthUser, Session } from "next-auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email }).lean();

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // Convert the user to the format expected by NextAuth
        const result: NextAuthUser = {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };

        return result;
      },
    }),
  ],

  callbacks: {
    async session({ session }: { session: Session }) {
      const mongodbUser = await User.findOne({
        email: session.user?.email,
      }).lean();

      // console.log(mongodbUser);

      if (mongodbUser) {
        session.user = {
          ...session.user,
          ...mongodbUser,
        };
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
