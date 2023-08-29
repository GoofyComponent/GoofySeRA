import { Check } from "lucide-react";
import { useState } from "react";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { ReservationContainer } from "@/components/app/project/Reservation/ReservationContainer";
import { Button } from "@/components/ui/button";

export const Planification = () => {
  const [teamIsValid, setTeamIsValid] = useState(false);
  console.log("teamIsValid", teamIsValid);

  return (
    <>
      <HeaderTitle title="Planification" previousTitle="Projet" />
      <div className="mx-6 flex flex-col justify-end">
        <Button
          className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          disabled={!teamIsValid}
        >
          <Check />
          <p className="ml-2">Validate this step</p>
        </Button>
        {!teamIsValid && (
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
          <ReservationContainer />
        </section>
      </div>
    </>
  );
};
