import clsx from "clsx";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";

import logo from "@/assets/images/sera-logo.svg";

export const metadata = {
  title: "SeRA Login",
  description: "Saline experience Royale Academy - Login",
};

const PLUS_JAKARTA_SANS = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="my-auto ml-6 h-[10vh] py-6">
        <Image
          src={logo}
          alt={"SeRA App"}
          priority
          placeholder="blur"
          blurDataURL="@/assets/images/sera-logo.webp"
        />
      </header>
      {children}
    </>
  );
}
