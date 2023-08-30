import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { ReservationContainer } from "@/components/app/project/Reservation/ReservationContainer";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";

export const Planification = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [teamIsValid, setTeamIsValid] = useState(false);
  const [reservationIsValid, setReservationIsValid] = useState(false);
  const [isPlanificationValid, setIsPlanificationValid] = useState(false);

  const passToCaptation = useMutation({
    mutationFn: async () => {
      const moveStep = await axios.post(
        `/api/projects/${ProjectId}/planification-to-captation`
      );
      return moveStep.data;
    },
    onSuccess: (response: any) => {
      console.log("response", response);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    if (teamIsValid && reservationIsValid) {
      setIsPlanificationValid(true);
    } else {
      setIsPlanificationValid(false);
    }
  }, [teamIsValid, reservationIsValid]);

  return (
    <>
      <HeaderTitle title="Planification" previousTitle="Projet" />
      <div className="mx-6 flex flex-col justify-end">
        <Button
          className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          disabled={!isPlanificationValid}
          onClick={() => {
            if (isPlanificationValid) {
              passToCaptation.mutate();
            }
          }}
        >
          <Check />
          <p className="ml-2">Validate this step</p>
        </Button>
        {!isPlanificationValid && (
          <p className="my-auto text-gray-600">
            You can&apos;t validate this step until your team is complete and
            you have at least one reservation.
          </p>
        )}
      </div>
      <div id="planification" className="mx-6 flex flex-col justify-start">
        <section id="planification-team" className="">
          <MembersContainer
            validTeam={teamIsValid}
            validTeamSetter={setTeamIsValid}
          />
        </section>
        <section id="rooms-container" className="">
          <ReservationContainer
            validReservation={reservationIsValid}
            validReservationSetter={setReservationIsValid}
          />
        </section>
      </div>
    </>
  );
};
