import { useQuery } from "@tanstack/react-query";
import { BadgeHelp } from "lucide-react";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
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

  if (error) return <>{error} . Erreur </>;

  return (
    <>
      <div>
        {!isLoading ? (
          <>
            <HeaderTitle
              title={projectData.title && projectData.title}
              previousTitle="Projet"
            />
            <div className="mx-6 mt-10">
              <h3 className="text-4xl">Description :</h3>
              <p className="mt-2 text-xl">{projectData.description}</p>
            </div>
            <div className="mx-6 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-4xl">Shared ressources :</h3>
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-sera-periwinkle">
                      {" "}
                      Add ressource
                    </Button>
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
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
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
          </>
        ) : (
          <BigLoader
            loaderSize={42}
            bgColor="transparent"
            textColor="sera-jet"
          />
        )}
      </div>
    </>
  );
};
