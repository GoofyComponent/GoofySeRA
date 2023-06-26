import clsx from "clsx";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";

import "@/assets/styles/globals.css";

import logo from "@/assets/images/sera-logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

const PLUS_JAKARTA_SANS = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "SeRA - Ultimate creation experience",
  description:
    "Saline experience Royale Academy - Manage and create your content !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={clsx(
          PLUS_JAKARTA_SANS.className,
          "h-screen w-full bg-sera-jet"
        )}
      >
        <header className="my-auto flex h-[10vh] justify-between p-6">
          <div className="flex w-5/12 justify-start">
            <Image src={logo} alt={"SeRA App"} />
            <h3 className="mx-8 mb-0 mt-auto text-2xl text-sera-periwinkle">
              Welcome back, (user) !
            </h3>
          </div>
          <div className="my-auto flex justify-end">
            <div className="relative my-auto mr-2 flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sera-periwinkle">
              <Bell className="m-auto text-[#916AF6]" />
            </div>
            <Avatar className="ml-2">
              <AvatarImage src="" />
              <AvatarFallback className="bg-sera-periwinkle font-semibold text-[#916AF6]">
                USR
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
