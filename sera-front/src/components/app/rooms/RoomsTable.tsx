import { Info, PenBox, Trash } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertDate } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const RoomsTable = ({ rooms }: { rooms: any }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50 ">
            <TableHead className="text-xl font-semibold text-sera-jet">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet ">
              Description
            </TableHead>
            <TableHead className="my-auto text-xl font-semibold text-sera-jet">
              Active Reservation
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet">
              Next Reservation
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-sera-jet">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        {rooms && (
          <TableBody>
            {rooms.map((room: any) => {
              return (
                <TableRow
                  key={room.id}
                  className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
                >
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-80">{room.name}</p>
                  </TableCell>
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-56">{room.description}</p>
                  </TableCell>
                  <TableCell className="text-base text-black">
                    <p className="w-12 truncate md:w-56">
                      {room.reservations.length > 0
                        ? `${room.reservations.length} active reservations`
                        : "No active reservations"}
                    </p>
                  </TableCell>
                  <TableCell className="text-left text-base text-black">
                    <p className="w-18 truncate md:w-80">
                      {room.reservations.length === 0
                        ? "No next reservation"
                        : `${convertDate(room.reservations[0].date)} from ${
                            room.reservations[0].start_time
                          } to ${room.reservations[0].end_time}`}
                    </p>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Link to={`/dashboard/rooms/${room.id}?action=infos`}>
                      <Info className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                    </Link>
                    <Link to={`/dashboard/rooms/${room.id}?action=edit`}>
                      <PenBox className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                    </Link>
                    <Link to={`/dashboard/rooms/${room.id}?action=delete`}>
                      <Trash className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {!rooms && (
        <BigLoader
          loaderSize={42}
          bgColor="sera-periwinkle/25"
          textColor="sera-jet"
        />
      )}
    </>
  );
};
