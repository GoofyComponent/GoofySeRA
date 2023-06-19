import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const PLUS_JAKARTA_SANS = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={PLUS_JAKARTA_SANS.className}>{children}</body>
    </html>
  );
}
