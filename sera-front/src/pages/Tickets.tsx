import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, /* Edit, */ Trash } from "lucide-react";
/* import { ChevronsUpDown } from "lucide-react";*/
import { useEffect, useState } from "react";
import React from "react";
import {
  Link,
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axios } from "@/lib/axios";
import { TicketsEntity } from "@/lib/types";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const Tickets = () => {
  const ticketStatus = "pending";

  const navigate = useNavigate();

  const { TicketId } = useParams<{ TicketId: string }>();
  const [searchParams] = useSearchParams();

  const isDelete = useMatch("/dashboard/tickets/:TicketId/delete");
  const isValidate = useMatch("/dashboard/tickets/:TicketId/validate");

  const [open, setOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [addTicketData, setAddTicketData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
  });

  const {
    data: ticketsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tickets", { page }],
    queryFn: async () => {
      const tickets = await axios.get(
        `api/projects-requests?page=${page}&status=${ticketStatus}`
      );

      console.log("tickets.data", tickets.data);

      return tickets.data;
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (TicketId: string) => {
      const tickets = await axios.delete(`api/projects-requests/${TicketId}`);
      return tickets;
    },
    onSuccess: () => {
      refetch();
      navigate(`/dashboard/tickets`);
    },
    onError: () => {
      navigate(`/dashboard/tickets/${TicketId}?action=delete`);
    },
  });

  const validateTicket = useMutation({
    mutationFn: async (formData: any) => {
      const tickets = await axios.post("/api/projects/init", formData);
      console.log("formData", formData);
      console.log("tickets", tickets);

      return tickets;
    },
    onSuccess: (data) => {
      console.log("data", data);
      const dataCleaned = data.data.original;
      console.log("datasuccess", data);
      navigate(`/dashboard/project/${dataCleaned.id}`);
    },
    onError: () => {
      navigate(`/dashboard/tickets/${TicketId}?action=validate`);
    },
  });

  const addTicket = useMutation({
    mutationFn: async (formData: any) => {
      const ticket = await axios.post("api/projects-requests", formData);
      return ticket;
    },
    onSuccess: () => {
      refetch();
      setAddTicketData({
        title: "",
        description: "",
        priority: "",
        status: "",
      });

      setTicketDialogOpen(false);
    },
    onError: () => {
      return console.log("error");
    },
  });

  const onSubmitAddTicketForm = async (data: {
    title: string;
    description: string;
    priority: string;
    status: string;
  }) => {
    console.log("dataEntered", data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("status", data.status);
    //Neeed is mandatory for the backend
    formData.append("needs", "1");

    addTicket.mutate(formData);
    return;
  };

  useEffect(() => {
    console.log("isValidate", isValidate);
    console.log("isDelete", isDelete);

    if (!ticketsData) {
      navigate("/dashboard/tickets");
    }

    if (searchParams.get("action") && TicketId) {
      setOpen(true);
      console.log(TicketId, open);
    } else {
      setOpen(false);
      console.log(TicketId, open);
    }

    if (isDelete && TicketId) {
      const deleteAction = deleteTicket.mutate(TicketId);
      console.log(deleteAction);
    }

    if (isValidate && TicketId) {
      const currentTicket = ticketsData.data.filter(
        (ticket: TicketsEntity) => ticket.id === Number(TicketId)
      );

      const formData = new FormData();
      formData.append("project_request_id", TicketId);
      formData.append("title", currentTicket[0].title);
      formData.append("description", currentTicket[0].description);

      const validateAction = validateTicket.mutate(formData);
      console.log(validateAction);
    }
  }, [TicketId, isDelete, isValidate]);

  if (isLoading || isError || !ticketsData.data)
    return <BigLoader loaderSize={42} bgColor="white" textColor="sera-jet" />;

  return (
    <>
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <h2>Ticket</h2>
        <Dialog
          onOpenChange={() => {
            setTicketDialogOpen(!ticketDialogOpen);
          }}
          open={ticketDialogOpen}
        >
          <Button
            onClick={() => setTicketDialogOpen(true)}
            className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          >
            Add a ticket
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new ticket ?</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex flex-col">
                <Label htmlFor="name">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={addTicketData.title}
                  className="col-span-3"
                  onChange={(e) =>
                    setAddTicketData({
                      ...addTicketData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="name">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  value={addTicketData.description}
                  className="col-span-3"
                  onChange={(e) =>
                    setAddTicketData({
                      ...addTicketData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <div>
                  <Label htmlFor="name">Priority</Label>
                  <Input
                    type="number"
                    id="priority"
                    value={addTicketData.priority}
                    className="col-span-3"
                    onChange={(e) =>
                      setAddTicketData({
                        ...addTicketData,
                        priority: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setAddTicketData({
                      ...addTicketData,
                      status: value,
                    })
                  }
                  value={addTicketData.status}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="refused">Refused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                onClick={() => onSubmitAddTicketForm(addTicketData)}
              >
                Create ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-sera-periwinkle/25">
            <TableHead className="w-72 truncate text-xl font-semibold text-black">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-black ">
              Date
              {/* <ChevronsUpDown className="my-auto ml-2" size={24} /> */}
            </TableHead>
            <TableHead className="my-auto text-xl font-semibold text-black">
              Owner
            </TableHead>
            <TableHead className="text-xl font-semibold text-black">
              Priority
              {/* <ChevronsUpDown className="my-auto ml-2" size={24} /> */}
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ticketsData.data.map((ticket: TicketsEntity) => {
            if (ticket.status === "accepted" || ticket.status === "refused")
              return;
            return (
              <TableRow
                key={ticket.id}
                className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
              >
                <TableCell className="text-base text-black">
                  {ticket.title}
                </TableCell>
                <TableCell className="text-base text-black">
                  {formatDate(ticket.created_at)}
                </TableCell>
                <TableCell className="hidden text-base text-black sm:block">
                  {ticket.user_id}
                </TableCell>
                <TableCell className="text-center">
                  <div
                    className={clsx(
                      `w-28 rounded-lg px-4 py-1 text-center text-base text-black`,
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
                  </div>
                </TableCell>
                <TableCell className="flex justify-end">
                  <Link to={`/dashboard/tickets/${ticket.id}?action=validate`}>
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
      </Table>
      <Pagination
        totalPages={ticketsData.last_page}
        currentPage={ticketsData.current_page}
        setNextPage={setPage}
      />
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (isOpen === true) return;
          setOpen(false);
        }}
      >
        <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {/* Get the selected ticket name */}
              {searchParams.get("action") === "validate" && "Validate - "}
              {searchParams.get("action") === "delete" && "Delete - "}
              {ticketsData.data.map((ticket: TicketsEntity) => (
                <React.Fragment key={ticket.id}>
                  {ticket.id === Number(TicketId) && ticket.title}
                </React.Fragment>
              ))}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {searchParams.get("action") === "validate" &&
                "Are you sure you want to validate this ticket ?"}
              {searchParams.get("action") === "delete" &&
                "Are you sure you want to delete this ticket ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to="/dashboard/tickets">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </Link>
            <Link
              to={
                searchParams.get("action") === "validate"
                  ? `/dashboard/tickets/${TicketId}/validate`
                  : `/dashboard/tickets/${TicketId}/delete`
              }
            >
              <AlertDialogAction>
                {searchParams.get("action") === "validate"
                  ? "Validate"
                  : "Delete"}
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
