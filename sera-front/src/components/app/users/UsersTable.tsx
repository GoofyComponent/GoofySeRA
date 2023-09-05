import { Edit, Trash } from "lucide-react";
import React from "react";
import { UsersEntity } from "@/lib/types/types";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BigLoader } from "@/pages/skeletons/BigLoader";

interface UsersTableProps {
  users?: UsersEntity[];
  isLoading?: boolean;
  isError?: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50 ">
            <TableHead className="text-xl font-semibold text-sera-jet">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet ">
              Email
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet">
              Role
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-sera-jet">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
        <TableBody>
          {users &&
            users.map((user: UsersEntity) => (
              <TableRow
                key={user.id}
                className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
              >
                <TableCell className="text-base text-black">
                  <p className="w-8 truncate md:w-56">
                    {user.firstname} {user.lastname}
                  </p>
                </TableCell>
                <TableCell className="text-base text-black">
                  <p className="w-16 truncate md:w-80">{user.email}</p>
                </TableCell>
                <TableCell className="text-base text-black">
                  <p className="w-12 truncate md:w-40">{user.role}</p>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Link to={`/dashboard/users/${user.id}?action=edit`}>
                    <Edit className="mr-2 hover:cursor-pointer hover:text-sera-jet" />
                  </Link>
                  <Link to={`/dashboard/users/${user.id}?action=delete`}>
                    <Trash className="ml-2 hover:cursor-pointer hover:text-sera-jet" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!users && (
        <BigLoader
          loaderSize={42}
          bgColor="sera-periwinkle/25"
          textColor="sera-jet"
        />
      )}
    </>
  );
};

export default UsersTable;
