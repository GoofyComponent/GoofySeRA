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

import { TicketsTable } from "@/components/app/tickets/ticketsTable";
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
import { axios } from "@/lib/axios";
import { TicketsEntity } from "@/lib/types";

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
    queryKey: ["tickets", { page }],
    queryFn: async () => {
      const tickets = await axios.get(
        `api/projects-requests?page=${page}&status=${ticketStatus}&sort=desc`
      );
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
      const dataCleaned = data.data.original;
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

        <TicketsTable tickets={isLoading ? undefined : ticketsData.data} />
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setNextPage={setPage}
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
      )}
    </section>
  );
};
