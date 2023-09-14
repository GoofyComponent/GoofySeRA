import { RefreshCw, Trash } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertDateFromDateType } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const ApiKeyTable = ({ data }: { data: any }) => {
  if (!data) return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50 ">
          <TableHead className="text-xl font-semibold text-sera-jet">
            <p className="md:w-80">API Key name</p>
          </TableHead>
          <TableHead className="my-auto text-xl font-semibold text-sera-jet">
            <p className="md:w-56">API Key description</p>
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            <p className="">API Key expiration</p>
          </TableHead>
          <TableHead className="text-right text-xl font-semibold text-sera-jet">
            <p className="">Action</p>
          </TableHead>
        </TableRow>
      </TableHeader>
      {data && data.length == 0 && (
        <TableCaption className="h-full min-h-[15rem] text-xl font-semibold text-sera-jet">
          No API keys at the moment
        </TableCaption>
      )}
      <TableBody>
        {data &&
          data.length > 0 &&
          data.map((keyElement: any, index: number) => {
            return (
              <TableRow
                key={index}
                className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
              >
                <TableCell className="text-base text-sera-jet">
                  <p>{keyElement.name}</p>
                </TableCell>
                <TableCell className="text-base text-sera-jet">
                  <p>{keyElement.description}</p>
                </TableCell>
                <TableCell className="text-base text-sera-jet">
                  <p>{convertDateFromDateType(keyElement.expiration)}</p>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Link to={`/dashboard/api/id?action=renew`}>
                    <RefreshCw className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                  </Link>
                  <Link to={`/dashboard/api/id?action=delete`}>
                    <Trash className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
