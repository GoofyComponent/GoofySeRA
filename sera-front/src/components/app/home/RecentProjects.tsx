import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { axios } from "@/lib/axios";

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
    data: projectsData,
    isLoading,
    // error,
    // isFetching,
  } = useQuery({
    queryKey: ["projects", { page }],
    queryFn: async () => {
      const projects = await axios.get(`api/projects?page=${page}`);

      console.log("projects.projectsData", projects.data);

      return projects.data;
    },
  });

  useEffect(() => {
    console.log("projectsData", projectsData);
  }, [projectsData]);

  return (
    <div className="m-10 rounded-lg bg-[#F2F1F6] p-10 pt-2">
      <h2 className="mb-2 text-4xl font-bold">Recent Projects</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!isLoading
          ? projectsData.data
              .slice(-3)
              .map(
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
              )
          : null}
        <Link to={"projects"}>
          <div className="h-[150px] overflow-hidden  text-ellipsis rounded-lg border-2 bg-sera-jet bg-cover bg-center p-3 text-white duration-300 ease-in-out hover:scale-105 ">
            <div className="flex items-center justify-between text-xl">
              <span>See more...</span>
            </div>
            <p className="pt-8">There is XX another projects</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export { RecentProjects };
