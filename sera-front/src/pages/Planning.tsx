import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { ReservationContainer } from "@/components/app/project/Reservation/ReservationContainer";
import { StepValidator } from "@/components/ui/stepValidator";
import { axios } from "@/lib/axios";

export const Planning = () => {
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
    onSuccess: () => {
      refetchProjectStepStatus();
      navigate(`/dashboard/projects/${ProjectId}/capture`);
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
      <HeaderTitle
        title="Planning"
        previousTitle={lastSeenProjectName}
        /*         linkPath={`/dashboard/projects/${ProjectId}`}
         */
      />

      <div className="mx-auto w-11/12">
        <StepValidator
          projectStepStatus={projectStepStatus}
          isprojectStatusLoading={isLoading}
          isprojectStatusSuccess={isSuccess}
          isCurrentStepValid={isPlanificationValid}
          mutationMethod={passToCaptation}
          cannotValidateMessage="You can't validate this step until your team is complete and you have at least one reservation."
          buttonMessage="Validate this step"
        />
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
