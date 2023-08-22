import clsx from "clsx";
import { Check, /* Edit, */ Trash } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketsEntity } from "@/lib/types/types";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const TicketsTable = ({ tickets }: { tickets: any }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50 ">
            <TableHead className="text-xl font-semibold text-sera-jet">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet ">
              Date
            </TableHead>
            <TableHead className="my-auto text-xl font-semibold text-sera-jet">
              Owner
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet">
              Priority
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-sera-jet">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        {tickets && (
          <TableBody>
            {tickets.map((ticket: TicketsEntity) => {
              if (ticket.status === "accepted" || ticket.status === "refused")
                return;
              return (
                <TableRow
                  key={ticket.id}
                  className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
                >
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-80">{ticket.title}</p>
                  </TableCell>
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-56">
                      {formatDate(ticket.created_at)}
                    </p>
                  </TableCell>
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-56">
                      {ticket.user.lastname}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="status"
                      className={clsx(
                        capitalizeFirstLetter(ticket.priority) === "High" &&
                          "bg-red-500",
                        capitalizeFirstLetter(ticket.priority) === "Medium" &&
                          "bg-yellow-200",
                        capitalizeFirstLetter(ticket.priority) === "Low" &&
                          "bg-lime-200"
                      )}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Link
                      to={`/dashboard/tickets/${ticket.id}?action=validate`}
                    >
                      <Check className="mr-2 hover:cursor-pointer hover:text-sera-jet" />
                    </Link>
                    {/* <Link to={`/dashboard/tickets/${ticket.id}?action=validate`}>
                    <Edit className="mr-2 hover:cursor-pointer hover:text-sera-jet" />
                  </Link> */}
                    <Link to={`/dashboard/tickets/${ticket.id}?action=delete`}>
                      <Trash className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {!tickets && (
        <BigLoader
          loaderSize={42}
          bgColor="sera-periwinkle/25"
          textColor="sera-jet"
        />
      )}
    </>
  );
};
