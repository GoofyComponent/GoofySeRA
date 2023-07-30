import { useQuery } from "@tanstack/react-query";
import { BadgeHelp } from "lucide-react";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

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
                    <Button className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
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
                    </DialogHeader>
                    <div>
                      <div className="flex flex-col">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          type="text"
                          id="title"
                          className="col-span-3"
                          
                        />
                      </div>
                      <div className="pt-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          type="textarea"
                          id="description"
                          className="col-span-3"
                        />
                      </div>
                      <div className="pt-4">
                        <Label htmlFor="description">Link</Label>
                        <Input
                          type="textarea"
                          id="description"
                          className="col-span-3"
                        />
                      </div>
                      <div className="pt-4">
                        <Label htmlFor="description">Tag</Label>
                        <Input
                          type="textarea"
                          id="description"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                    <DialogTrigger>
                      <Button className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                        Cancel
                      </Button>
                      </DialogTrigger>
                      <Button type="submit" className="bg-sera-periwinkle text-sera-jet hover:bg-sera-periwinkle/50 hover:text-sera-jet/50">
                        add ressource
                      </Button>
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
