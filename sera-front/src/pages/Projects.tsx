import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card-project";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Projects = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("0");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: projectsData,
    isLoading,
    error,
    // isFetching,
  } = useQuery({
    queryKey: ["projects", { page, status }],
    queryFn: async () => {
      let requestUrl = `api/projects?page=${page}&sort=desc&maxPerPage=16`;
      if (status != "0") requestUrl += `&status=${status}`;

      const projects = await axios.get(requestUrl);
      return projects.data;
    },
  });

  useEffect(() => {
    if (projectsData) {
      setTotalPages(projectsData.last_page);
      setCurrentPage(projectsData.current_page);
    }
  }, [projectsData]);

  if (error) return <>{error}</>;

  return (
    <>
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
            <h2>Projects</h2>
            <TooltipProvider>
              <Tooltip>
                <Select
                  defaultValue=""
                  name="status"
                  value={status}
                  onValueChange={(value) => {
                    setPage(1);
                    setStatus(value);
                  }}
                >
                  <TooltipTrigger asChild>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </TooltipTrigger>
                  <SelectContent>
                    <SelectItem value="0">All</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <TooltipContent className="rounded bg-popover ">
                  <p>Sort by status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {!isLoading &&
          Array.isArray(projectsData.data) &&
          projectsData.data.length > 0 ? (
            <div className=" mx-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projectsData.data.map(
                (project: {
                  id: string;
                  skeleton: boolean;
                  title: string;
                  status: string;
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
          ) : !isLoading &&
            Array.isArray(projectsData.data) &&
            projectsData.data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-2xl font-semibold text-sera-jet">
                No projects found
              </p>
            </div>
          ) : (
            <></>
          )}
          {isLoading && (
            <BigLoader
              loaderSize={42}
              bgColor="transparent"
              textColor="sera-jet"
            />
          )}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setNextPage={setPage}
          isCurrentlyLoading={isLoading}
        />
      </div>
    </>
  );
};
