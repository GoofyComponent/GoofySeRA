import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface SharedRessourcesProps {
  skeleton: boolean;
  name: string;
  description: string;
  date: string;
  url: string;
}

const SharedRessources = ({
  skeleton,
  name,
  description,
  date,
  url,
}: SharedRessourcesProps) => {
  if (skeleton) return <></>;

  return (
    <>
      <div className="flex items-center justify-between rounded bg-sera-periwinkle p-4">
        <div className="flex items-center">
          <div className="mr-2 flex h-10 w-10 items-center justify-center">
            <Link to={url} target="blank">
              <ExternalLink size={20} className="text-[#916AF6]" />
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-xs">{date}</p>
            <p className="text- mt-1">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export { SharedRessources };
