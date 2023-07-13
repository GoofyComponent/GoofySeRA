import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
<<<<<<< HEAD
=======
import clsx from "clsx";
import { ChevronsUpDown } from "lucide-react";
// import { useDialogState } from "reakit/Dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
>>>>>>> 85b9075 (ajout des systemes de trie)

// import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
<<<<<<< HEAD
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Tickets = () => {
  interface Ticket {
    name: string;
    date: string;
    owner: string;
    priority: string;
    id: number;
    TicketUrl: string;
  }
=======

interface Ticket {
  name: string;
  date: string;
  owner: string;
  priority: string;
  id: number;
  TicketUrl: string;
}
>>>>>>> 85b9075 (ajout des systemes de trie)

export const Tickets = () => {
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

  const { TicketId } = useParams<{ TicketId: string }>();
  const [open, setOpen] = useState(false);

  // gere l'ouverture de la modal en fonction de l'id du ticket dans l'url
  useEffect(() => {
    if (TicketId) {
      setOpen(true);
      console.log(TicketId, open);
    } else {
      setOpen(false);
      console.log(TicketId, open);
    }
  }, [TicketId]);

  //si option Recent alors on affiche les tickets par ordre de date
  const [ticketsTrie, setTicketsTrie] = useState("recent");

  // gere le trie des tickets par date ou par priorité
  const handleSortByPriority = () => {
    if (ticketsTrie === "priorityhight") {
      setTicketsTrie("prioritylow");
    } else if (ticketsTrie === "prioritylow") {
      setTicketsTrie("priorityhight");
    } else {
      setTicketsTrie("priorityhight");
    }
  };

  // gere le trie des tickets par date ou par priorité
  const handleSortByDate = () => {
    if (ticketsTrie === "recent") {
      setTicketsTrie("old");
    } else if (ticketsTrie === "old") {
      setTicketsTrie("recent");
    } else {
      setTicketsTrie("recent");
    }
  };

  const renderTicketsTrie = () => {
    let result;
    // si option recent alors on affiche les tickets par ordre de date (recent,old)
    ticketsTrie === "recent"
      ? (result = tickets.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }))
      : // si option old alors on affiche les tickets par ordre de date (old,recent)
      ticketsTrie === "old"
      ? (result = tickets.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }))
      : // si option priorityhight alors on affiche les tickets par ordre de priorité (High, Medium, Low)
      ticketsTrie === "priorityhight"
      ? (result = tickets.sort((a, b) => {
          if (a.priority === "High" && b.priority === "Medium") {
            return -1;
          }
          if (a.priority === "High" && b.priority === "Low") {
            return -1;
          }
          if (a.priority === "Medium" && b.priority === "High") {
            return 1;
          }
          if (a.priority === "Medium" && b.priority === "Low") {
            return -1;
          }
          if (a.priority === "Low" && b.priority === "High") {
            return 1;
          }
          if (a.priority === "Low" && b.priority === "Medium") {
            return 1;
          }
          return 0;
        }))
      : // si option prioritylow alors on affiche les tickets par ordre de priorité ( Low,Medium,High)
      ticketsTrie === "prioritylow"
      ? (result = tickets.sort((a, b) => {
          if (a.priority === "High" && b.priority === "Medium") {
            return 1;
          }
          if (a.priority === "High" && b.priority === "Low") {
            return 1;
          }
          if (a.priority === "Medium" && b.priority === "High") {
            return -1;
          }
          if (a.priority === "Medium" && b.priority === "Low") {
            return 1;
          }
          if (a.priority === "Low" && b.priority === "High") {
            return -1;
          }
          if (a.priority === "Low" && b.priority === "Medium") {
            return -1;
          }
          return 0;
        }))
      : (result = tickets);
    return result;
  };
  // on stocke les tickets triés dans une constante
  const sortedTickets = renderTicketsTrie();

  return (
    <>
      <div className="pt-2">
        <h2 className="mb-2 px-4 text-4xl font-bold">Ticket</h2>
        <Table>
          <TableCaption>List des tickets Recent</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-xl font-semibold text-black">
                Name
              </TableHead>
              <TableHead className="text-xl font-semibold text-black ">
                <span
                  onClick={handleSortByDate}
                  className="mx-auto flex w-fit cursor-pointer touch-none items-center justify-center rounded-lg border px-8 py-1"
                >
                  Date
                  <ChevronsUpDown className="my-auto ml-2" size={24} />
                </span>
              </TableHead>
              <TableHead className="hidden text-xl font-semibold text-black sm:block">
                Owner
              </TableHead>
              <TableHead className="text-center text-xl font-semibold text-black">
                <span
                  className="mx-auto flex w-fit cursor-pointer items-center justify-center rounded-lg border px-8 py-1"
                  onClick={handleSortByPriority}
                >
                  Priority
                  <ChevronsUpDown className="my-auto ml-2" size={24} />
                </span>
              </TableHead>
              <TableHead className="text-right text-xl font-semibold text-black">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.map((ticket) => (
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
                <TableCell className="text-center">
                  <span
                    className={clsx(
                      `rounded-lg px-4 py-1 text-base text-black`,
                      ticket.priority === "High" && "bg-red-500",
                      ticket.priority === "Medium" && "bg-yellow-200",
                      ticket.priority === "Low" && "bg-lime-200 "
                    )}
                  >
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell className="text-right text-base">
                  {ticket.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (isOpen === true) return;
          setOpen(false);
        }}
      >
        <AlertDialogContent className=" max-w-5xl border-[#D3D4D5]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to="/dashboard/tickets">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </Link>
            <AlertDialogAction>Validate</AlertDialogAction>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
