import clsx from "clsx";
import { Info, PenBox, Trash } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const KnowledgeTable = ({ datas }: { datas: any }) => {
  if (!datas) return <BigLoader bgColor="transparent" textColor="ser-jet" />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50">
          <TableHead className="text-xl font-semibold text-sera-jet">
            Name
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            Informations
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            Type
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {datas.map((data: any, index: number) => (
          <Row
            key={index}
            name={data.name}
            infos={data.infos}
            imageUrl={data.imageURL}
            type={data.type}
          />
        ))}
      </TableBody>
    </Table>
  );
};

const Row = ({
  name,
  infos,
  imageUrl,
  type,
}: {
  name: string;
  infos: string;
  imageUrl: string;
  type: string;
}) => {
  return (
    <TableRow className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50">
      <TableCell
        className={clsx(
          "text-base text-black",
          imageUrl && "flex justify-start"
        )}
      >
        {imageUrl && (
          <Avatar className="my-auto mr-4">
            <AvatarImage src={imageUrl} />
          </Avatar>
        )}
        <p className="my-auto truncate">{name}</p>
      </TableCell>
      <TableCell className="text-base text-black">
        <p className="line-clamp-2">{infos}</p>
      </TableCell>
      <TableCell className="text-base text-black">
        <p className="truncate">{type}</p>
      </TableCell>
      <TableCell>
        <div className="my-auto flex">
          <Link to={`/dashboard/knowledge/${"room"}?action=infos`}>
            <Info className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
          </Link>
          <Link to={`/dashboard/knowledge/${"room"}?action=edit`}>
            <PenBox className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
          </Link>
          <Link to={`/dashboard/knowledge/${"room"}?action=delete`}>
            <Trash className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};
