import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";

export const Planification = () => {
  return (
    <>
      <HeaderTitle title="Planification" previousTitle="Projet" />
      <section id="planification">
        <MembersContainer />
        {/*         <RoomContainer />
         */}
      </section>
    </>
  );
};
