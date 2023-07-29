import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
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
        `api/projects?page=${page}&sort=desc&maxPerPage=3`
      );

      console.log("recentprojectsData recent", recentprojects.data);

      return recentprojects.data;
    },
  });

  return (
    <div className="m-6 rounded-lg bg-[#F2F1F6] px-4 pb-4 pt-2">
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
          <Link to={"projects"}>
            <div className="h-[150px] overflow-hidden  text-ellipsis rounded-lg border-2 bg-sera-jet bg-cover bg-center p-3 text-white duration-300 ease-in-out hover:scale-105 ">
              <div className="flex items-center justify-between text-xl">
                <span>See more...</span>
              </div>
              <p className="pt-8">There is XX another projects</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex max-h-[9em] w-full items-center">
          <BigLoader
            loaderSize={42}
            bgColor="sera-periwinkle/25"
            textColor="sera-jet"
          />
        </div>
      )}
    </div>
  );
};

export { RecentProjects };
