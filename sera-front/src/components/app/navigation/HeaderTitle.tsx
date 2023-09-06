import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

interface HeaderTitleProps {
  title?: string;
  porjectStatus?: string;
  linkPath?: string | number;
  previousTitle?: string;
}

export const HeaderTitle = ({
  title,
  porjectStatus,
  linkPath = -1,
  previousTitle,
}: HeaderTitleProps) => {
  if (title === "" || title === undefined || title === null) {
    title = document.title || "Sera";
  }

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
      <span className="text-4xl font-semibold text-sera-jet">
        {porjectStatus}
      </span>
      <Badge
        className={clsx(
          porjectStatus === "cancelled" && "bg-red-500 hover:bg-red-500",
          porjectStatus === "ongoing" && "bg-yellow-200 hover:bg-yellow-200",
          porjectStatus === "completed" && "bg-lime-200 hover:bg-lime-200 ",
          "my-auto ml-auto rounded px-2 py-1 text-xl font-normal text-sera-jet"
        )}
      >
        {porjectStatus
          ? porjectStatus.charAt(0).toUpperCase() + porjectStatus.slice(1)
          : ""}
      </Badge>
    </div>
  );
};
