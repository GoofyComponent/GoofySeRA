import clsx from "clsx";
import {
  BookOpen,
  DoorOpen,
  FolderOpen,
  Home,
  Ticket,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { checkLastSeenProject } from "@/lib/utils";

export const Nav = () => {
  const pathname = useLocation();

  const lastSeenProject = useSelector(
    (state: any) => state.app.lastSeenProjectId
  );

  return (
    <nav className="h-[90vh] w-[14%] border-r-2 border-[#D3D4D5]">
      <ul className="flex h-full flex-col justify-start py-4">
        {lastSeenProject && (
          <>
            <Link
              to={`/dashboard/projects/${lastSeenProject}`}
              className={clsx(
                "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
                "flex text-sera-jet",
                checkLastSeenProject(pathname.pathname, lastSeenProject) &&
                  "bg-sera-jet text-sera-periwinkle ",
                "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
              )}
            >
              <FolderOpen size={32} className="my-auto mr-2" />
              <p className="my-auto hidden text-2xl font-semibold lg:block">
                Last seen
              </p>
            </Link>
            <Separator className="my-2 mr-2" />
          </>
        )}
        <Link
          to="/dashboard"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
            "flex   text-sera-jet",
            matchPath(pathname.pathname, "/dashboard") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <Home size={32} className="my-auto mr-2" />
          <p className="my-auto hidden text-2xl font-semibold lg:block">
            Dashboard
          </p>
        </Link>
        <Link
          to="/dashboard/users"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
            "flex text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/users") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <User size={32} className="my-auto mr-2" />
          <p className="my-auto hidden text-2xl font-semibold lg:block">
            Users
          </p>
        </Link>
        <Link
          to="/dashboard/rooms"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
            "flex text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/rooms") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <DoorOpen size={32} className="my-auto mr-2" />
          <p className="my-auto hidden text-2xl font-semibold lg:block">
            Rooms
          </p>
        </Link>
        <Link
          to="/dashboard/tickets"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
            "flex   text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/tickets") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <Ticket size={32} className="my-auto mr-2" />
          <p className="my-auto hidden text-2xl font-semibold lg:block">
            Tickets
          </p>
        </Link>
        <Link
          to="/dashboard/projects"
          className={clsx(
            "mx-2 my-2 h-14 rounded-lg px-1 transition-all",
            "flex   text-sera-jet",
            matchPath(pathname.pathname, "/dashboard/projects") &&
              "bg-sera-jet text-sera-periwinkle",
            "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
          )}
        >
          <BookOpen size={32} className="my-auto mr-2" />
          <p className="my-auto hidden text-2xl font-semibold lg:block">
            Projects
          </p>
        </Link>
      </ul>
    </nav>
  );
};
