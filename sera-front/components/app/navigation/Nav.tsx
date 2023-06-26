"use client";

import clsx from "clsx";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Ticket, BookOpen } from "lucide-react";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="h-[90vh] w-[14%] border-r-2 border-[#D3D4D5]">
      <ul className="flex h-full flex-col justify-start py-4">
        <Link
          href="/dashboard/tickets"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg",
            "flex justify-around text-sera-jet",
            pathname === "/dashboard/tickets" &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <Ticket size={32} className="my-auto" />
          <p className="my-auto text-2xl font-semibold">Tickets</p>
        </Link>
        <Link
          href="/dashboard/projects"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg",
            "flex justify-around text-sera-jet",
            pathname === "/dashboard/projects" &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <BookOpen size={32} className="my-auto" />
          <p className="my-auto text-2xl font-semibold">Projects</p>
        </Link>
      </ul>
    </nav>
  );
};
