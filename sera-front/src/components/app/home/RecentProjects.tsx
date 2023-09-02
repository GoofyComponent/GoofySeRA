import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card-project";
import { axios } from "@/lib/axios";
import { BigLoader } from "@/pages/skeletons/BigLoader";

// interface Project {
//   skeleton: false;
//   id: string;
//   title: string;
//   status: "Done" | "Draft" | "in Progress";
//   description: string;
//   bgImage: string;
//   colors: string;
// }

const RecentProjects = () => {
  const page = 1;

  const {
    data: recentprojectsData,
    isLoading,
    // error,
    // isFetching,
  } = useQuery({
    queryKey: ["recentprojects", { page }],
    queryFn: async () => {
      const recentprojects = await axios.get(
        `api/projects?page=${page}&sort=desc&maxPerPage=4`
      );
      return recentprojects.data;
    },
  });

  return (
    <div className="m-6 rounded-lg bg-sera-grey-bg px-4 pb-4 pt-2">
      <div className="flex justify-between py-2">
        <h2 className="mb-2 text-4xl font-semibold text-sera-jet">
          Recent Projects{" "}
          {!isLoading
            ? recentprojectsData.data && (
                <span className="text-sm font-normal italic">
                  This is the last 3 recent projects
                </span>
              )
            : null}
        </h2>
        <Link to="/dashboard/projects" className="my-auto mr-4">
          <Button className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
            View all
          </Button>
        </Link>
      </div>
      {!isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recentprojectsData.data.map(
            (project: {
              id: string;
              skeleton: boolean;
              title: string;
              status: any;
              description: string;
              colors: string;
            }) => (
              <Card
                key={project.id}
                skeleton={project.skeleton}
                id={project.id}
                title={project.title}
                status={project.status}
                description={project.description}
                colors={project.colors}
              />
            )
          )}
        </div>
      ) : (
        <div className="flex max-h-[9em] w-full items-center">
          <BigLoader
            loaderSize={42}
            bgColor="transparent"
            textColor="sera-jet"
          />
        </div>
      )}
    </div>
  );
};

export { RecentProjects };
