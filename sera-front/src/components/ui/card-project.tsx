import clsx from "clsx";
import { Link } from "react-router-dom";

import { Badge } from "./badge";

interface CardsProps {
  skeleton: boolean;
  id: string;
  title: string;
  status: string;
  description: string;
  colors: string;
}
let titleBgColor = "";
const Card = ({
  skeleton,
  colors,
  title,
  status,
  description,
  id = "",
}: CardsProps) => {
  if (status === "cancelled") {
    titleBgColor = "bg-red-500";
  } else if (status === "published") {
    titleBgColor = "bg-lime-200";
  } else if (status === "ongoing") {
    titleBgColor = "bg-yellow-200";
  }
  const color1 = colors[0];
  const color2 = colors[1];
  if (skeleton) return <></>;
  return (
    <Link to={`/dashboard/projects/${id}`}>
      <div
        style={{
          backgroundImage: `linear-gradient(45deg, ${color1}, ${color2})`,
        }}
        className={clsx(
          ` h-[150px] rounded-lg border-2 bg-cover bg-center p-3 text-white duration-300 ease-in-out hover:scale-105 `
        )}
      >
        <div className="flex flex-col justify-between text-xl">
          <Badge
            variant="status"
            className={clsx(titleBgColor, "ml-auto mr-0 w-auto text-sm")}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <p className="truncate">{title}</p>
        </div>
        <p className="w-11/12 truncate pt-4 text-left">{description}</p>
      </div>
    </Link>
  );
};
export { Card };
