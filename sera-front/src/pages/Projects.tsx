import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { axios } from "@/lib/axios";

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

  //gere le changement de valeur du select
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectTrie(e.target.value);
  };

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

  if (isLoading) return <>sa charge PD ...</>;

  if (error) return <>{error} . Erreur de PD</>;

  return (
    <>
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <h2>Projects</h2>
        <select
          className="mr-10 h-9 rounded-lg border bg-transparent px-12 py-1 text-base font-semibold outline-0"
          value={projectTrie}
          onChange={handleOnChange}
        >
          <option value="" disabled selected hidden>
            trier par ...
          </option>
          <option className="text-base" value="ongoing">
            ongoing
          </option>
          <option className="text-base" value="completed">
            completed
          </option>
          <option className="text-base" value="cancelled">
            cancelled
          </option>
        </select>
      </div>

      <div className="mx-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!isLoading
          ? projectsData.data.map(
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
            )
          : null}
      </div>
      <Pagination
        totalPages={projectsData.last_page}
        currentPage={projectsData.current_page}
        setNextPage={setPage}
      />
    </>
  );
};
