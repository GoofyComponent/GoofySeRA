import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Projects = () => {
  const [page, setPage] = useState(1);

  const {
    data: projectsData,
    isLoading,
    error,
    // isFetching,
  } = useQuery({
    queryKey: ["projects", { page }],
    queryFn: async () => {
      const projects = await axios.get(`api/projects?page=${page}&sort=desc`);
      return projects.data;
    },
  });

  const [projectTrie, setProjectTrie] = useState("");

  //trie les projets en fonction de la valeur du select en rangeant les projets par status (ongoing, completed, cancelled) si completed est selectionné, les projets completed seront en premier puis ongoing puis cancelled si ongoing est selectionné, les projets ongoing seront en premier puis completed puis cancelled si cancelled est selectionné, les projets cancelled seront en premier puis completed puis ongoing
  if (projectTrie === "ongoing") {
    !isLoading
      ? projectsData.data.sort((a: any) => {
          if (a.status === "ongoing") {
            return -1;
          } else if (a.status === "completed") {
            return 1;
          } else if (a.status === "cancelled") {
            return 1;
          }
          return 0;
        })
      : null;
  } else if (projectTrie === "completed") {
    !isLoading
      ? projectsData.data.sort((a: any) => {
          if (a.status === "completed") {
            return -1;
          } else if (a.status === "ongoing") {
            return 1;
          } else if (a.status === "cancelled") {
            return 1;
          }
          return 0;
        })
      : null;
  } else if (projectTrie === "cancelled") {
    !isLoading
      ? projectsData.data.sort((a: any) => {
          if (a.status === "cancelled") {
            return -1;
          } else if (a.status === "ongoing") {
            return 1;
          } else if (a.status === "completed") {
            return 1;
          }
          return 0;
        })
      : null;
  }

  if (error) return <>{error} . Erreur de PD</>;

  return (
    <>
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
            <h2>Projects</h2>
            <Select
              defaultValue=""
              name="status"
              value={projectTrie}
              onValueChange={(value) => {
                setProjectTrie(value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled hidden>
                  trier par ...
                </SelectItem>
                <SelectItem value="ongoing">ongoing</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
                <SelectItem value="cancelled">cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!isLoading ? (
            <div className="mx-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          ) : (
            <BigLoader
              loaderSize={42}
              bgColor="transparent"
              textColor="sera-jet"
            />
          )}
        </div>
        {!isLoading ? (
          <Pagination
            totalPages={projectsData.last_page}
            currentPage={projectsData.current_page}
            setNextPage={setPage}
            isCurrentlyLoading={isLoading}
          />
        ) : null}
      </div>
    </>
  );
};
