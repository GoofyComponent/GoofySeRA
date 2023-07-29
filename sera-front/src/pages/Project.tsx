import { useQuery } from "@tanstack/react-query";
import { BadgeHelp, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

// import { SharedRessources } from "../components/ui/sharedRessources";

export const Project = () => {
  const params = useParams();
  const id = params.ProjectId;
  const {
    data: projectData,
    isLoading,
    error,
    // isFetching,
  } = useQuery({
    queryKey: ["project", { id }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${id}`);
      return project.data;
    },
  });

  if (isLoading) return;
  <BigLoader
    loaderSize={42}
    bgColor="sera-periwinkle/25"
    textColor="sera-jet"
  />;

  if (error) return <>{error} . Erreur </>;

  return (
    <>
      <div>
        <div className="m-10 pt-2 ">
          <div className="flex items-center">
            <Link to="..">
              <ChevronLeft
                size={48}
                className="mr-2 rounded-full bg-sera-periwinkle duration-200 ease-in-out hover:scale-105"
              />
            </Link>
            <span className="ml-4 text-4xl">Projet</span>
            <ChevronRight size={48} className="ml-2" />
            <h3 className="text-4xl font-bold">{projectData.title}</h3>
          </div>
          <div className="mt-10">
            <h3 className="text-4xl">Description :</h3>
            <p className="mt-2 text-xl">{projectData.description}</p>
          </div>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-4xl">Shared ressources :</h3>
              <Dialog>
                <DialogTrigger>
                  <Button className="bg-sera-periwinkle"> Add ressource</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center">
                        <BadgeHelp size={44} />
                        <span className="ml-2"> Add ressource </span>
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogTrigger>Cancel</DialogTrigger>
                    <Button>Continue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {/* <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {project.ressources.map((ressource, index) => (
                <SharedRessources
                  key={index}
                  skeleton={project.skeleton}
                  name={ressource.name}
                  description={ressource.description}
                  date={ressource.Date}
                  url={ressource.url}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
