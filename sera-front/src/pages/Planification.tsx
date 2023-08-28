import { useState } from "react";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { RoomContainer } from "@/components/app/project/Rooms/RoomContainer";

export const Planification = () => {
  const [teamIsValid, setTeamIsValid] = useState(false);
  console.log("teamIsValid", teamIsValid);

  return (
    <>
      <HeaderTitle title="Planification" previousTitle="Projet" />
      <div id="planification" className="mx-6 flex justify-between">
        <section id="planification-team" className="w-5/12">
          <MembersContainer validTeamSetter={setTeamIsValid} />
        </section>
        <section id="rooms-container" className="w-5/12">
          <RoomContainer />
        </section>
      </div>
    </>
  );
};
