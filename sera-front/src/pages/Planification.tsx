import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CheckSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { ReservationContainer } from "@/components/app/project/Reservation/ReservationContainer";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";

export const Planification = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );

  const [teamIsValid, setTeamIsValid] = useState(false);
  const [reservationIsValid, setReservationIsValid] = useState(false);
  const [isPlanificationValid, setIsPlanificationValid] = useState(false);
  const navigate = useNavigate();

  const {
    data: projectStepStatus,
    isLoading,
    isSuccess,
    refetch: refetchProjectStepStatus,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Planning`
      );
      return project.data[0].status;
    },
  });

  const passToCaptation = useMutation({
    mutationFn: async () => {
      const moveStep = await axios.post(
        `/api/projects/${ProjectId}/planification-to-captation`
      );
      return moveStep.data;
    },
    onSuccess: (response: any) => {
      refetchProjectStepStatus();
      navigate(`/dashboard/projects/${ProjectId}/captation`);
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
      <HeaderTitle title="Planification" previousTitle={lastSeenProjectName} />
      <div className="mx-6 flex flex-col justify-end">
        {isLoading && !isSuccess && (
          <p className="text-center italic">Loading...</p>
        )}
        {projectStepStatus != "done" && isSuccess && (
          <>
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
                You can&apos;t validate this step until your team is complete
                and you have at least one reservation.
              </p>
            )}
          </>
        )}
        {projectStepStatus === "done" && isSuccess && (
          <div className="my-auto flex justify-center rounded-lg border-2 border-sera-jet text-center text-sera-jet">
            <CheckSquare size={32} className="my-auto mr-4" />
            <div className="flex flex-col justify-center text-center">
              <p className="font-bold">This step has been validated.</p>
              <p className="font-extralight italic">
                You can still update the information
              </p>
            </div>
          </div>
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
