import clsx from "clsx";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/assets/styles/globals.css";

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
        {children}
      </body>
    </html>
  );
}
