import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ticket {
  name: string;
  date: string;
  owner: string;
  priority: string;
  id: number;
  TicketUrl: string;
}

const tickets: Ticket[] = [
  {
    name: "Projet A",
    date: "2023-07-01",
    owner: "John Doe",
    priority: "High",
    id: 1,
    TicketUrl: "https://example.com/random-meme-1",
  },
  {
    name: "Projet B",
    date: "2023-06-28",
    owner: "Jane Smith",
    priority: "Medium",
    id: 2,
    TicketUrl: "https://example.com/random-meme-2",
  },
  {
    name: "Projet C",
    date: "2023-07-05",
    owner: "Robert Johnson",
    priority: "Low",
    id: 3,
    TicketUrl: "https://example.com/random-meme-3",
  },
  {
    name: "Projet D",
    date: "2023-06-30",
    owner: "Emily Brown",
    priority: "Medium",
    id: 4,
    TicketUrl: "https://example.com/random-meme-4",
  },
  {
    name: "Projet E",
    date: "2023-07-02",
    owner: "Michael Wilson",
    priority: "High",
    id: 5,
    TicketUrl: "https://example.com/random-meme-5",
  },
  {
    name: "Projet F",
    date: "2023-07-03",
    owner: "Sophia Davis",
    priority: "Low",
    id: 6,
    TicketUrl: "https://example.com/random-meme-6",
  },
  {
    name: "Projet G",
    date: "2023-06-29",
    owner: "Daniel Taylor",
    priority: "Medium",
    id: 7,
    TicketUrl: "https://example.com/random-meme-7",
  },
  {
    name: "Projet H",
    date: "2023-07-04",
    owner: "Olivia Johnson",
    priority: "High",
    id: 8,
    TicketUrl: "https://example.com/random-meme-8",
  },
  {
    name: "Projet I",
    date: "2023-07-01",
    owner: "Liam Anderson",
    priority: "Low",
    id: 9,
    TicketUrl: "https://example.com/random-meme-9",
  },
  {
    name: "Projet J",
    date: "2023-06-27",
    owner: "Emma Lee",
    priority: "Medium",
    id: 10,
    TicketUrl: "https://example.com/random-meme-10",
  },
];

export const RecentTicketTable = () => {
  return (
    <div className="m-10 rounded-lg bg-[#F2F1F6] pt-2">
      <div className="flex justify-between">
        <h2 className="mb-2 px-4 text-4xl font-bold">Ticket</h2>
        <Link to="/dashboard/tickets" className="my-auto mr-4">
          <p className="text-xl font-semibold text-sera-jet underline">
            View all
          </p>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-xl font-semibold text-black">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-black">
              Date
            </TableHead>
            <TableHead className="hidden text-xl font-semibold text-black sm:block">
              Owner
            </TableHead>
            <TableHead className="text-xl font-semibold text-black">
              Priority
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets
            .slice(-4)
            .reverse()
            .map((ticket) => (
              <TableRow
                key={ticket.id}
                className="odd:bg-[#EFEBF8] even:bg-[#F2F1F6]"
              >
                <TableCell className="text-base text-black">
                  <Link
                    to={`/dashboard/tickets/${ticket.id}`}
                    className="underline"
                  >
                    {ticket.name}
                  </Link>
                </TableCell>
                <TableCell className="text-base text-black">
                  {ticket.date}
                </TableCell>
                <TableCell className="hidden text-base text-black sm:block">
                  {ticket.owner}
                </TableCell>
                <TableCell className="text-base text-black">
                  {ticket.priority}
                </TableCell>
                <TableCell className="text-right text-base">
                  {ticket.id}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
