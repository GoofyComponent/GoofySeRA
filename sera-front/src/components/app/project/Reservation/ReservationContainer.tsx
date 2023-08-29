import { /* useMutation */ useQuery } from "@tanstack/react-query";
/* import { Clapperboard, PenBox } from "lucide-react";
import { useState } from "react"; */
import { useParams } from "react-router-dom";

/* 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; */
import { axios } from "@/lib/axios";
/* import { convertDate, formatDate } from "@/lib/utils";
 */ import { BigLoader } from "@/pages/skeletons/BigLoader";

export const ReservationContainer = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();

  const {
    /*  data: projectRoom, */
    isLoading,
    /*     refetch: projectRoomRefetch,
     */
  } = useQuery({
    queryKey: ["projectRoom", { ProjectId }],
    queryFn: async () => {
      const projectRoom = await axios.get(
        `api/projects/${ProjectId}/rooms?reservation=true`
      );

      return projectRoom.data;
    },
  });

  if (isLoading) return <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />;

  return (
    <>
      <h3 className="text-4xl font-medium text-sera-jet">Reservations :</h3>
      <div className="flex flex-col justify-start">
        {/*  {projectRoom &&
          projectRoom.map((room: any) => (
            <ReservationCard
              key={room.id}
              roomId={room.id}
              roomName={room.name}
              roomDescription={room.description}
              reservationId={room.reservation_id}
              reservationDate={room.reservation_date}
              reservationStartTime={room.reservation_start_time}
              reservationEndTime={room.reservation_end_time}
              projectRoomRefetch={projectRoomRefetch}
            />
          ))} */}
      </div>
    </>
  );
};

/* const ReservationCard = ({
  roomId,
  roomName,
  roomDescription,
  reservationId,
  reservationDate,
  reservationStartTime,
  reservationEndTime,
  projectRoomRefetch,
}: {
  roomId: number;
  roomName: string;
  roomDescription: string;
  reservationId: number;
  reservationDate: string;
  reservationStartTime: string;
  reservationEndTime: string;
  projectRoomRefetch: () => void;
}) => {
  const [roomModal, setRoomModal] = useState(false);

  const unReserveRoom = useMutation({
    mutationFn: async () => {
      const unReserve = await axios.post(`api/projects/room/unreserve`, {
        reservation_id: roomId,
      });
      return unReserve.data;
    },
    onSuccess: () => {
      projectRoomRefetch();
      setRoomModal(false);
    },
  });

  const timewithoutseconds = (time: string) => {
    const timeArray = time.split(":");
    return `${timeArray[0]}:${timeArray[1]}`;
  };

  return (
    <>
      <div className="m-2 flex h-full w-96 justify-start rounded-lg border-2 border-sera-jet px-1">
        <Clapperboard className="my-auto mr-2" size={48} />
        <div className="w-8/12">
          <h4 className="truncate text-xl">{roomName}</h4>
          <p className="text-normal  truncate">{roomDescription}</p>
          <p className="text-normal truncate">
            {reservationId && formatDate(reservationDate)}
          </p>
        </div>
        <Button
          className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          aria-label={`Remove ${name} from the project`}
          onClick={() => setRoomModal(true)}
        >
          <PenBox size={28} strokeWidth={2.25} />
        </Button>
      </div>

      <Dialog
        open={roomModal}
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setRoomModal(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{roomName}</DialogTitle>
            <DialogDescription>{roomDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center">
            <p className="text-lg">Your reservation:</p>
            <p className="text-lg">
              {reservationId ? (
                <span>No reservation</span>
              ) : (
                <span>
                  {convertDate(reservationDate)} from {reservationStartTime} to{" "}
                  {reservationEndTime}
                </span>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button
              className="border-2 border-sera-jet bg-white text-sera-jet hover:bg-gray-300"
              onClick={() => setRoomModal(false)}
            >
              Close
            </Button>
           
            <Button
              className="bg-red-600 hover:bg-red-300"
              onClick={(e) => {
                e.preventDefault();
                unReserveRoom.mutate();
              }}
            >
              Remove this reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; */
