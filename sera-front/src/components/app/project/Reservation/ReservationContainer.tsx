import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  PenBox,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { axios } from "@/lib/axios";
import { accessManager, convertDate, selectRoleDisplay } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const ReservationContainer = ({
  validReservation,
  validReservationSetter,
}: {
  validReservation?: boolean;
  validReservationSetter?: (valid: boolean) => void;
}) => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [roomSearchModal, setRoomSearchModal] = useState(false);

  const {
    data: projectReservations,
    isLoading,
    refetch: projectReservationsRefetch,
  } = useQuery({
    queryKey: ["projectReservations", { ProjectId }],
    queryFn: async () => {
      const projectReservations = await axios.get(
        `api/projects/${ProjectId}/rooms?reservation=true&alternative=true`
      );
      return projectReservations.data;
    },
  });

  useEffect(() => {
    if (!validReservationSetter) return;
    if (!projectReservations) return;
    if (projectReservations.length === 0) {
      validReservationSetter(false);
    } else {
      validReservationSetter(true);
    }
  }, [projectReservations]);

  if (isLoading) return <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />;

  return (
    <>
      <h3 className="text-4xl font-medium text-sera-jet">
        Reservations :{" "}
        {!validReservation && (
          <span className="text-base text-red-700">
            You are missing at least one reservation.
          </span>
        )}
      </h3>
      <div className="mx-auto flex flex-row flex-wrap">
        {accessManager(undefined, "add_reservations") && (
          <button
            className="m-2 flex min-h-full w-96 justify-start rounded-lg border-2 border-dashed border-sera-jet px-4 py-2"
            onClick={() => setRoomSearchModal(true)}
            aria-label="Open the user search modal"
          >
            <Plus className="m-auto" />
            <p className="m-auto text-xl">ADD A RESERVATION</p>
          </button>
        )}

        {projectReservations &&
          projectReservations.map((reservation: any) => (
            <ReservationCard
              key={reservation.id}
              roomName={reservation.rooms.name}
              roomDescription={reservation.rooms.description}
              reservationId={reservation.id}
              reservationDate={reservation.date}
              reservationStartTime={reservation.start_time}
              reservationEndTime={reservation.end_time}
              projectRoomRefetch={projectReservationsRefetch}
            />
          ))}
      </div>
      <SearchRoomDialog
        roomSearchModal={roomSearchModal}
        setRoomSearchModal={setRoomSearchModal}
        projectReservationsRefetch={projectReservationsRefetch}
      />
    </>
  );
};

const ReservationCard = ({
  roomName,
  roomDescription,
  reservationId,
  reservationDate,
  reservationStartTime,
  reservationEndTime,
  projectRoomRefetch,
}: {
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
        reservation_id: reservationId,
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
          <h4 className="text-xl">
            {convertDate(reservationDate)}{" "}
            {`${timewithoutseconds(reservationStartTime)}-${timewithoutseconds(
              reservationEndTime
            )}`}
          </h4>
          <p className="text-normal truncate">{roomName}</p>
          <p className="text-normal  truncate">{roomDescription}</p>
        </div>
        {accessManager(undefined, "remove_reservations") && (
          <Button
            className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            aria-label={`Remove ${name} from the project`}
            onClick={() => setRoomModal(true)}
          >
            <PenBox size={28} strokeWidth={2.25} />
          </Button>
        )}
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
            {/* <Button className="border-2 border-sera-jet bg-white text-sera-jet hover:bg-gray-300">
                Edit
              </Button> */}
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
};

const SearchRoomDialog = ({
  roomSearchModal,
  setRoomSearchModal,
  projectReservationsRefetch,
}: {
  roomSearchModal: boolean;
  setRoomSearchModal: (open: boolean) => void;
  projectReservationsRefetch: () => void;
}) => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [date, setDate] = useState<Date>(new Date());

  const [startTimeInput, setStartTimeInput] = useState("08:00");
  const [endTimeInput, setEndTimeInput] = useState("09:00");

  const [calculatedDuration, setCalculatedDuration] = useState("60");

  const [selectedRoomDetails, setSelectedRoomDetails] = useState<any>();
  const [reservationName, setReservationName] = useState("");
  const [reservationMembers, setReservationMembers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: projectMembers } = useQuery({
    queryKey: ["projectMembers", { ProjectId }],
    queryFn: async () => {
      const projectMembers = await axios.get(`api/projects/${ProjectId}/teams`);
      return projectMembers.data;
    },
  });

  const {
    data: roomSearch,
    isLoading: roomSearchIsLoading,
    refetch: roomSearchRefetch,
  } = useQuery({
    queryKey: ["roomSearch", { date, calculatedDuration, roomSearchModal }],
    queryFn: async () => {
      let call = `api/rooms/available?`;
      if (calculatedDuration) call += `duration=${calculatedDuration}&`;
      if (date) call += `date=${date.toISOString().split("T")[0]}`;

      const roomAvailable = await axios.get(call);

      let roomFiltered;
      if (roomAvailable.data) {
        roomFiltered = roomAvailable.data.filter((room: any) => {
          let isAvailable = true;
          if (!room.reservations) return true;
          room.reservations.forEach((reservation: any) => {
            if (
              reservation.date === date.toISOString().split("T")[0] &&
              reservation.start_time === `${startTimeInput}:00` &&
              reservation.end_time === `${endTimeInput}:00`
            ) {
              isAvailable = false;
            }
          });
          return isAvailable;
        });
      }

      //Remove from roomFiltered the duplicated rooms
      const roomFilteredIds: number[] = [];
      const roomFilteredNoDuplicate = roomFiltered.filter((room: any) => {
        if (roomFilteredIds.includes(room.id)) return false;
        roomFilteredIds.push(room.id);
        return true;
      });

      return roomFilteredNoDuplicate;
    },
  });

  const reserveRoom = useMutation({
    mutationFn: async () => {
      const reserve = await axios.post(
        `/api/projects/${ProjectId}/room/reserve`,
        {
          room_id: selectedRoomDetails.id,
          title: reservationName,
          date: date.toISOString().split("T")[0],
          start_time: startTimeInput,
          end_time: endTimeInput,
          users_id: reservationMembers,
        }
      );
      return reserve.data;
    },
    onSuccess: () => {
      projectReservationsRefetch();
      setRoomSearchModal(false);
    },
    onError: (error: any) => {
      if (error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(error.response.data.message);
      }
    },
  });

  useEffect(() => {
    setStartTimeInput("08:00");
    setEndTimeInput("09:00");
    setCalculatedDuration("60");
    setSelectedRoomDetails(undefined);
    setReservationName("");
    setReservationMembers([]);
  }, [roomSearchModal]);

  useEffect(() => {
    setErrorMessage("");
  }, [selectedRoomDetails]);

  useEffect(() => {
    if (
      isNaN(parseInt(startTimeInput.split(":")[0])) ||
      isNaN(parseInt(startTimeInput.split(":")[1])) ||
      isNaN(parseInt(endTimeInput.split(":")[0])) ||
      isNaN(parseInt(endTimeInput.split(":")[1]))
    ) {
      setCalculatedDuration("60");
      return;
    }

    const startTime = startTimeInput.split(":");
    const endTime = endTimeInput.split(":");

    const startHour = parseInt(startTime[0]);
    const startMinute = parseInt(startTime[1]);

    const endHour = parseInt(endTime[0]);
    const endMinute = parseInt(endTime[1]);

    let duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);

    if (duration < 0) duration += 24 * 60;

    setCalculatedDuration(duration.toString());
  }, [startTimeInput, endTimeInput]);

  return (
    <Dialog
      open={roomSearchModal}
      onOpenChange={(open) => setRoomSearchModal(open)}
    >
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Search a room</DialogTitle>
        </DialogHeader>
        <article className="">
          <Label>Date</Label>
          <DatePicker date={date} setDate={setDate} />
          <Label className="mt-4">Debut (hh:mm)</Label>
          <Input
            className="mb-1 w-full"
            type="string"
            value={startTimeInput}
            onChange={(e) => setStartTimeInput(e.target.value)}
            placeholder="HH:MM"
          />
          <Label className="mt-1">End (hh:mm)</Label>
          <Input
            className="mb-4 w-full"
            type="string"
            value={endTimeInput}
            onChange={(e) => setEndTimeInput(e.target.value)}
            placeholder="HH:MM"
          />

          <Button
            className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            onClick={() => roomSearchRefetch()}
          >
            <Search size={24} />
          </Button>

          <Separator className="my-4 h-0.5 bg-sera-jet/50" />

          {!selectedRoomDetails && (
            <div className="mx-auto my-4 flex max-h-96 flex-col items-center overflow-auto align-middle scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-2">
              <h4>
                For a {calculatedDuration}-minute booking, the following rooms
                are available
              </h4>
              {roomSearchIsLoading && (
                <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />
              )}
              {roomSearch &&
                !roomSearchIsLoading &&
                roomSearch.map((item: any) => (
                  <div
                    key={item.id}
                    className="m-2 flex h-full w-96 justify-start rounded-lg border-2 border-sera-jet px-1"
                  >
                    <Clapperboard className="my-auto mr-2" size={48} />
                    <div className="w-8/12">
                      <h4 className="text-xl">{item.name}</h4>
                      <p className="text-normal truncate">{item.description}</p>
                    </div>
                    <Button
                      className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                      aria-label={`Add ${item.name} to the project`}
                      onClick={() => setSelectedRoomDetails(item)}
                    >
                      <ArrowRight className="m-auto" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
          {selectedRoomDetails && (
            <div className="mx-auto my-4 flex max-h-96 flex-col overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-2">
              <Button
                className=" w-16 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                onClick={() => setSelectedRoomDetails(undefined)}
              >
                <ArrowLeft className="m-auto" />
              </Button>
              <h4 className="m-auto text-center underline">
                You selected the following room
              </h4>

              <p className="text-lg font-medium">Name:</p>
              <p className="text-base">{selectedRoomDetails.name}</p>
              <p className="text-lg font-medium">Description:</p>
              <p className="text-base">{selectedRoomDetails.description}</p>
              <p className="text-lg font-medium">Reservation name:</p>
              <Input
                className="mx-auto mb-4 w-11/12"
                type="string"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
                placeholder="Reservation name"
              />
              <p className="text-lg font-medium">Reservation members:</p>
              <div className="my-2 flex flex-wrap justify-center align-middle">
                {projectMembers.users &&
                  projectMembers.users.map((member: any) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      key={member.id}
                      className={clsx(
                        "m-2 w-5/12 rounded-lg border-2 px-2 py-1",
                        "hover:cursor-pointer hover:bg-sera-jet/50 hover:text-sera-periwinkle/50",
                        reservationMembers.includes(member.id) &&
                          "bg-sera-jet text-sera-periwinkle"
                      )}
                      onClick={() => {
                        if (reservationMembers.includes(member.id)) {
                          setReservationMembers(
                            reservationMembers.filter((id) => id !== member.id)
                          );
                        } else {
                          setReservationMembers([
                            ...reservationMembers,
                            member.id,
                          ]);
                        }
                      }}
                    >
                      {member.lastname} {member.firstname} -{" "}
                      {selectRoleDisplay(member.role)}
                    </div>
                  ))}
              </div>
              {errorMessage && (
                <p className="text-center text-red-600">{errorMessage}</p>
              )}
              <Button
                className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                onClick={() => reserveRoom.mutate()}
              >
                Add this reservation
              </Button>
            </div>
          )}
        </article>
      </DialogContent>
    </Dialog>
  );
};
