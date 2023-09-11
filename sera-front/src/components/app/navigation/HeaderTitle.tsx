import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderTitleProps {
  title?: string;
  projectStatus?: string;
  linkPath?: string | number;
  previousTitle?: string;
}

export const HeaderTitle = ({
  title,
  projectStatus,
  linkPath = -1,
  previousTitle,
}: HeaderTitleProps) => {
  useEffect(() => {
    if (title === "" || title === undefined || title === null) {
      title = `Sera - ${document.title}` || "Sera";
    } else {
      document.title = `Sera - ${title}` || "Sera";
    }

    return () => {
      document.title = "Sera Dashboard";
    };
  }, []);

  return (
    <div className="m-6 flex items-center text-sera-jet">
      <Button variant="title" size="title" className="mr-4" asChild>
        <Link
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          to={linkPath}
        >
          <ChevronLeft size={50} strokeWidth={3} />
        </Link>
      </Button>
      {previousTitle && (
        <>
          <span className="ml-4 text-4xl">{previousTitle}</span>
          <ChevronRight size={48} className="ml-2" />
        </>
      )}
      <h3 className="my-auto text-4xl font-semibold text-sera-jet">{title}</h3>
      {projectStatus ? (
        <Badge
          className={clsx(
            projectStatus === "cancelled" && "bg-red-500 hover:bg-red-500",
            projectStatus === "ongoing" && "bg-yellow-200 hover:bg-yellow-200",
            projectStatus === "completed" && "bg-lime-200 hover:bg-lime-200 ",
            "my-auto ml-auto rounded px-2 py-1 text-xl font-normal text-sera-jet"
          )}
        >
          {projectStatus.charAt(0).toUpperCase() + projectStatus.slice(1)}
        </Badge>
      ) : null}
    </div>
  );
};
