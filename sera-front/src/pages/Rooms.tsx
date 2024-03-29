import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  DeleteModal,
  EditModal,
  InfosModal,
} from "@/components/app/rooms/RoomsModals";
import { RoomsTable } from "@/components/app/rooms/RoomsTable";
import { AlertDialog } from "@/components/ui/alert-dialog";
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
import { axios } from "@/lib/axios";
import { accessManager } from "@/lib/utils";

export const Rooms = () => {
  const navigate = useNavigate();

  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();

  const isDelete = useMatch("/dashboard/rooms/:roomId/delete");
  const isValidate = useMatch("/dashboard/rooms/:roomIdId/validate");

  const [openModal, setOpenModal] = useState(false);
  const [roomDialogOpen, setTicketDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [addRoomData, setAddRoomData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!accessManager("rooms", undefined)) {
      return navigate("/dashboard");
    }
  }, []);

  const {
    data: roomsData,
    isLoading,
    isError,
    refetch: roomsRefetch,
  } = useQuery({
    queryKey: ["rooms", { page }],
    queryFn: async () => {
      const rooms = await axios.get(`api/rooms?page=${page}&sort=desc`);
      return rooms.data;
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (roomId: string) => {
      const rooms = await axios.delete(`api/rooms/${roomId}`);
      return rooms;
    },
    onSuccess: () => {
      roomsRefetch();
      navigate(`/dashboard/rooms`);
    },
    onError: () => {
      navigate(`/dashboard/rooms/${roomId}?action=delete`);
    },
  });

  const addRoom = useMutation({
    mutationFn: async (formData: any) => {
      const room = await axios.post("api/rooms", formData);
      return room;
    },
    onSuccess: () => {
      roomsRefetch();
      setAddRoomData({
        name: "",
        description: "",
      });

      setTicketDialogOpen(false);
    },
  });

  const onSubmitAddRoomForm = async (data: {
    name: string;
    description: string;
  }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    if (!data.name || !data.description) return console.log("error");

    addRoom.mutate(formData);
    return;
  };

  useEffect(() => {
    if (roomsData) {
      setTotalPages(roomsData.last_page);
      setCurrentPage(roomsData.current_page);
    }
  }, [roomsData]);

  useEffect(() => {
    /* if (!roomsData) {
      navigate("/dashboard/rooms");
    } */

    if (searchParams.get("action") && roomId) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }

    if (isDelete && roomId) {
      deleteTicket.mutate(roomId);
      return;
    }
  }, [roomId, isDelete, isValidate]);

  if (isError) {
    return <div>error</div>;
  }

  return (
    <section className="flex h-full flex-col justify-between">
      <div>
        <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
          <h2>Rooms</h2>

          <Dialog
            onOpenChange={() => {
              setTicketDialogOpen(!roomDialogOpen);
            }}
            open={roomDialogOpen}
          >
            {accessManager(undefined, "add_room") && (
              <Button
                onClick={() => setTicketDialogOpen(true)}
                className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              >
                Add a room
              </Button>
            )}

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new room ?</DialogTitle>
              </DialogHeader>
              <div>
                <div className="flex flex-col">
                  <Label htmlFor="title" className="mb-2">
                    Room name
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={addRoomData.name}
                    className="col-span-3"
                    onChange={(e) =>
                      setAddRoomData({
                        ...addRoomData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="mb-2">
                    Address
                  </Label>
                  <Input
                    type="textarea"
                    id="description"
                    value={addRoomData.description}
                    className="col-span-3"
                    onChange={(e) =>
                      setAddRoomData({
                        ...addRoomData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                  onClick={() => onSubmitAddRoomForm(addRoomData)}
                >
                  Create room
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <RoomsTable
          rooms={isLoading ? undefined : roomsData.data}
          loading={isLoading}
        />
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setNextPage={setPage}
        isCurrentlyLoading={isLoading}
      />

      {!isLoading && roomId && (
        <AlertDialog
          open={openModal}
          onOpenChange={(isOpen) => {
            if (isOpen === true) return;
            setOpenModal(false);
          }}
        >
          {searchParams.get("action") === "infos" && <InfosModal id={roomId} />}
          {searchParams.get("action") === "edit" && (
            <EditModal id={roomId} roomsRefecht={roomsRefetch} />
          )}
          {searchParams.get("action") === "delete" && (
            <DeleteModal id={roomId} roomsRefetch={roomsRefetch} />
          )}
        </AlertDialog>
      )}
    </section>
  );
};
