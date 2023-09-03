import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import React from "react";
import {
  Link,
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { TicketsTable } from "@/components/app/tickets/TicketsTable";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axios } from "@/lib/axios";
import { TicketsEntity } from "@/lib/types/types";
import { formatDate } from "@/lib/utils";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

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
  const [sort, setSort] = useState("desc");
  const [priority, setPriority] = useState("0");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [addTicketData, setAddTicketData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "pending",
  });

  const {
    data: ticketsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tickets", { page, priority, sort }],
    queryFn: async () => {
      let requestUrl = `api/projects-requests?page=${page}&status=${ticketStatus}&sort=${sort}`;
      if (priority != "0") requestUrl += `&priority=${priority}`;

      const tickets = await axios.get(requestUrl);
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

      return tickets;
    },
    onSuccess: (data) => {
      const dataCleaned = data.data;
      navigate(`/dashboard/projects/${dataCleaned.id}`);
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
        status: "pending",
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
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("status", "pending");
    //Neeed is mandatory for the backend
    formData.append("needs", "1");

    addTicket.mutate(formData);
    return;
  };

  function trigerCloseDialog() {
    setOpen(false);
    navigate(`/dashboard/tickets`);
  }

  useEffect(() => {
    if (ticketsData) {
      setTotalPages(ticketsData.last_page);
      setCurrentPage(ticketsData.current_page);
    }
  }, [ticketsData]);

  useEffect(() => {
    if (!ticketsData) {
      navigate("/dashboard/tickets");
    }

    if (searchParams.get("action") && TicketId) {
      setOpen(true);
    } else {
      setOpen(false);
    }

    if (isDelete && TicketId) {
      deleteTicket.mutate(TicketId);
      return;
    }

    if (isValidate && TicketId) {
      const currentTicket = ticketsData.data.filter(
        (ticket: TicketsEntity) => ticket.id === Number(TicketId)
      );

      const formData = new FormData();
      formData.append("project_request_id", TicketId);
      formData.append("title", currentTicket[0].title);
      formData.append("description", currentTicket[0].description);

      validateTicket.mutate(formData);
      return;
    }
  }, [TicketId, isDelete, isValidate]);

  if (isError) {
    return <div>error</div>;
  }

  return (
    <section className="flex h-full flex-col justify-between">
      <div>
        <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
          <h2>Tickets</h2>
          <div className="flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <Select
                  defaultValue=""
                  name="status"
                  value={priority}
                  onValueChange={(value) => {
                    setPriority(value);
                  }}
                >
                  <TooltipTrigger asChild>
                    <SelectTrigger className="mr-2 w-[180px]">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </TooltipTrigger>
                  <SelectContent>
                    <SelectItem value="0">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <TooltipContent className="rounded bg-popover ">
                  <p>Sort by priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                    <Label htmlFor="title">Title</Label>
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
                    <Label htmlFor="description">Description</Label>
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="priority"
                      value={addTicketData.priority}
                      onValueChange={(value) => {
                        setAddTicketData({
                          ...addTicketData,
                          priority: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">High</SelectItem>
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
        </div>

        <TicketsTable
          tickets={isLoading ? undefined : ticketsData.data}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setNextPage={setPage}
        isCurrentlyLoading={isLoading}
      />

      {!isLoading && (
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
                {searchParams.get("action") === "infos" &&
                  ticketsData.data.map((ticket: TicketsEntity) => (
                    <React.Fragment key={ticket.id}>
                      {ticket.id === Number(TicketId) && (
                        <>
                          <div className="mb-4">
                            <p className="font-bold">Description :</p>
                            <p>{ticket.description}</p>
                          </div>
                          <div className="mb-4 flex">
                            <div className=" flex pr-5">
                              <p className="my-auto font-bold">Priority :</p>
                              <Badge
                                className={clsx(
                                  ticket.priority === "high" &&
                                    "bg-red-500 hover:bg-red-500",
                                  ticket.priority === "medium" &&
                                    "bg-yellow-200 hover:bg-yellow-200",
                                  ticket.priority === "low" &&
                                    "bg-lime-200 hover:bg-lime-200 ",
                                  "my-auto ml-2 rounded px-2 py-1 text-sera-jet"
                                )}
                              >
                                {ticket.priority.charAt(0).toUpperCase() +
                                  ticket.priority.slice(1)}
                              </Badge>
                            </div>
                            <div className="my-auto flex">
                              <p className="font-bold">created at :</p>
                              <p> {formatDate(ticket.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <p className="font-bold ">by :</p>
                            <p>{ticket.user.lastname}</p>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* si action = infos, on affiche uniquement le bouton close sinon
              on affiche les boutons cancel et action */}
              {searchParams.get("action") === "infos" ? (
                <Link to="/dashboard/tickets">
                  <AlertDialogAction>Close</AlertDialogAction>
                </Link>
              ) : (
                <AlertDialogCancel
                  onClick={() => {
                    trigerCloseDialog();
                  }}
                >
                  Cancel
                </AlertDialogCancel>
              )}
              {searchParams.get("action") === "validate" ? (
                <Link to={`/dashboard/tickets/${TicketId}/validate`}>
                  <AlertDialogAction>Validate</AlertDialogAction>
                </Link>
              ) : (
                ""
              )}
              {searchParams.get("action") === "delete" ? (
                <Link to={`/dashboard/tickets/${TicketId}/delete`}>
                  <AlertDialogAction>Delete</AlertDialogAction>
                </Link>
              ) : (
                ""
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
};
