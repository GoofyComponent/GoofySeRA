import { BadgeHelp, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

import { SharedRessources } from "../components/ui/sharedRessources";


export const Project = () => {


  const project = {
    skeleton: false,
    projectUrl: "1",
    title: "Projet 1",
    projectState: "Done",
    shortDesc: "Description courte du projet 1",
    // description field with lorem ipsum
    desciption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consequat pharetra lectus, eu facilisis orci dictum eget. Sed ac varius ligula. Vivamus at purus non ipsum suscipit convallis eget ac odio. Nam eu dolor nisl. Pellentesque pellentesque, urna id finibus euismod, turpis neque fermentum dolor, Etiam vel sapien sed purus ultricies lacinia. Nulla facilisi. Vivamus et ligula in turpis pellentesque facilisis id ac purus.",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    ressources: [
      {
        name: "Ressource 1",
        description: "Description de la ressource 1",
        Date: "2021-10-10",
        url: "https://www.google.com",
      },
      {
        name: "Ressource 2",
        description: "Description de la ressource 2",
        Date: "2021-10-10",
        url: "https://www.google.com",
      },
      {
        name: "Ressource 3",
        description: "Description de la ressource 3",
        Date: "2021-10-10",
        url: "https://www.google.com",
      },
      {
        name: "Ressource 4",
        description: "Description de la ressource 4",
        Date: "2021-10-10",
        url: "https://www.google.com",
      },
      {
        name: "Ressource 5",
        description: "Description de la ressource 5",
        Date: "2021-10-10",
        url: "https://www.google.com",
      },
    ],
  };

  return (
    <>
      <div>
        <div className="m-10 pt-2 ">
          <div className="flex items-center">
            <Link to="/dashboard/projects">
              <ChevronLeft
                size={48}
                className="mr-2 rounded-full bg-sera-periwinkle duration-200 ease-in-out hover:scale-105"
              />
            </Link>
            <span className="ml-4 text-4xl">Projet</span>
            <ChevronRight size={48} className="ml-2" />
            <h3 className="text-4xl font-bold">{project.title}</h3>
          </div>
          <div className="mt-10">
            <h3 className="text-4xl">Description :</h3>
            <p className="mt-2 text-xl">{project.desciption}</p>
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
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
