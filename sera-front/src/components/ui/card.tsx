import clsx from "clsx";
import { Link } from "react-router-dom";

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
  } else if (status === "completed") {
    titleBgColor = "bg-lime-200";
  } else if (status === "ongoing") {
    titleBgColor = "bg-amber-300";
  }

  const color1 = colors[0];
  const color2 = colors[1];

  if (skeleton) return <></>;

  return (
    <Link to={`/dashboard/project/${id}`}>
      <div
        style={{
          backgroundImage: `linear-gradient(45deg, ${color1}, ${color2})`,
        }}
        className={clsx(
          ` h-[150px] rounded-lg border-2 bg-cover bg-center p-3 text-white duration-300 ease-in-out hover:scale-105 `
        )}
      >
        <div className="flex items-center justify-between text-xl">
          <p className="truncate">{title} </p>
          <p className={clsx(`rounded-lg px-4 py-1 text-black`, titleBgColor)}>
            {status}
          </p>
        </div>
        <p className="w-11/12 truncate pt-4 text-left">{description}</p>
      </div>
    </Link>
  );
};

export { Card };
