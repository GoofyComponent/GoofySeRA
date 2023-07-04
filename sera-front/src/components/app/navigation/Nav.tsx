import clsx from "clsx";
import { BookOpen, Ticket } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router-dom";

export const Nav = () => {
  const pathname = useLocation();

  return (
    <nav className="h-[90vh] w-[14%] border-r-2 border-[#D3D4D5]">
      <ul className="flex h-full flex-col justify-start py-4">
        <Link
          to="/dashboard/tickets"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg",
            "flex justify-around text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/tickets") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <Ticket size={32} className="my-auto" />
          <p className="my-auto text-2xl font-semibold">Tickets</p>
        </Link>
        <Link
          to="/dashboard/projects"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg",
            "flex justify-around text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/projects") &&
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
