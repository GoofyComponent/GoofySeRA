import { RecentProjects } from "@/components/app/home/RecentProjects";
import { RecentTicketTable } from "@/components/app/home/RecentTicketTable";
import { accessManager } from "@/lib/utils";

export const Home = () => {
  return (
    <>
      <RecentProjects />
      {accessManager("project_requests", undefined) && <RecentTicketTable />}
    </>
  );
};
