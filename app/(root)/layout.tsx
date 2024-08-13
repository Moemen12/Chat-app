import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Provider from "@/components/shared/Provider";
import TopBar from "@/components/shared/TopBar";
import ToasterContext from "@/components/shared/ToasterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Halo Chat",
  description: "Build a Next 14 Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <ToasterContext />
          <TopBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
