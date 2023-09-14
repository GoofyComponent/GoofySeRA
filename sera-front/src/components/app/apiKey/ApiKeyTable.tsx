import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertDateFromDateType } from "@/lib/utils";

export const ApiKeyTable = ({ data }: { data: any }) => {
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
      <TableBody>
        {console.log(data, data.length, data.length > 0)}
        {data &&
          data.length > 0 &&
          data.map((keyElement: any) => {
            return (
              <TableRow
                key={keyElement.id}
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
                <TableCell>
                  <Button
                    variant="outline"
                    className="text-sera-jet hover:text-sera-periwinkle"
                    onClick={() => {
                      console.log(keyElement);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
