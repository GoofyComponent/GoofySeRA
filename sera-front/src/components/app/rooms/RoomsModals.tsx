import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axios } from "@/lib/axios";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const DeleteModal = ({
  id,
  roomsRefetch,
}: {
  id: string;
  roomsRefetch: any;
}) => {
  const navigate = useNavigate();

  const deleteRoomQuery = useMutation({
    mutationFn: async (roomId: string) => {
      const room = await axios.delete(`api/rooms/${roomId}`);
      return room;
    },
    onSuccess: () => {
      console.log("success");
      roomsRefetch();
      navigate(`/dashboard/rooms`);
    },
  });

  return (
    <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this room ?</AlertDialogTitle>
        <AlertDialogDescription>
          You can&apos;t undo this action.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Link to="/dashboard/rooms">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </Link>
        <AlertDialogAction
          className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => deleteRoomQuery.mutate(id)}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export const EditModal = ({
  id,
  roomsRefecht,
}: {
  id: string;
  roomsRefecht: any;
}) => {
  const navigate = useNavigate();
  const [updatedRoomData, setUpdatedRoomData] = useState({
    name: "",
    description: "",
  });

  const { isLoading, refetch: editedRoomRefetch } = useQuery({
    queryKey: ["room", { id }],
    queryFn: async () => {
      const rooms = await axios.get(`api/rooms/${id}`);

      setUpdatedRoomData({
        name: rooms.data.name,
        description: rooms.data.description,
      });

      return rooms.data;
    },
    cacheTime: 0,
  });

  const updateRoomQuery = useMutation({
    mutationFn: async (formData: any) => {
      const room = await axios.put(`api/rooms/${id}`, formData);
      return room;
    },
    onSuccess: () => {
      editedRoomRefetch();
      roomsRefecht();
      navigate(`/dashboard/rooms/${id}?action=infos`);
    },
  });

  if (isLoading) {
    return (
      <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update the room</AlertDialogTitle>
        </AlertDialogHeader>
        <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />
      </AlertDialogContent>
    );
  }

  return (
    <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
      <AlertDialogHeader>
        <AlertDialogTitle>Update the room</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <div className="flex flex-col">
          <Label htmlFor="name" className="mb-2">
            Room name
          </Label>
          <Input
            type="text"
            id="name"
            value={updatedRoomData.name}
            className="col-span-3"
            onChange={(e) =>
              setUpdatedRoomData({
                ...updatedRoomData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="description" className="mb-2">
            Description
          </Label>
          <Input
            type="textarea"
            id="description"
            value={updatedRoomData.description}
            className="col-span-3"
            onChange={(e) =>
              setUpdatedRoomData({
                ...updatedRoomData,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>
      <AlertDialogFooter>
        <Link to="/dashboard/rooms">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </Link>
        <Button
          type="submit"
          className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => updateRoomQuery.mutate(updatedRoomData)}
        >
          Update room
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export const InfosModal = ({ id }: { id: string }) => {
  const { data: roomData, isLoading } = useQuery({
    queryKey: ["room", { id }],
    queryFn: async () => {
      const rooms = await axios.get(`api/rooms/${id}`);
      return rooms.data;
    },
  });

  if (isLoading) {
    return (
      <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
        <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />
      </AlertDialogContent>
    );
  }

  return (
    <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
      <AlertDialogHeader>
        <AlertDialogTitle>Room - {roomData.name}</AlertDialogTitle>
        <AlertDialogDescription>{roomData.description}</AlertDialogDescription>
      </AlertDialogHeader>
      <div>[CALENDAR OF THE ROOM]</div>
      <AlertDialogFooter>
        <Link to="/dashboard/rooms">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </Link>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
