import { Card } from "@/components/ui/card";
import { useState } from "react";

export const Projects = () => {
  interface Project {
    skeleton: false;
    projectUrl: string;
    title: string;
    projectState: "Done" | "Draft" | "in Progress";
    shortDesc: string;
    bgImage: string;
  }

  const projects: Project[] = [
    {
      skeleton: false,
      projectUrl: "projet-1",
      title: "Projet 1",
      projectState: "Done",
      shortDesc: "Description courte du projet 1",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-2",
      title: "Projet 2",
      projectState: "Draft",
      shortDesc: "Description courte du projet 2",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-3",
      title: "Projet 3",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 3",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-4",
      title: "Projet 4",
      projectState: "Done",
      shortDesc: "Description courte du projet 4",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-5",
      title: "Projet 5",
      projectState: "Draft",
      shortDesc: "Description courte du projet 5",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-6",
      title: "Projet 6",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 6",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-7",
      title: "Projet 7",
      projectState: "Done",
      shortDesc: "Description courte du projet 7",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-8",
      title: "Projet 8",
      projectState: "Draft",
      shortDesc: "Description courte du projet 8",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-9",
      title: "Projet 9",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 9",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-10",
      title: "Projet 10",
      projectState: "Done",
      shortDesc: "Description courte du projet 10",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-1",
      title: "Projet 1",
      projectState: "Done",
      shortDesc: "Description courte du projet 1",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-2",
      title: "Projet 2",
      projectState: "Draft",
      shortDesc: "Description courte du projet 2",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-3",
      title: "Projet 3",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 3",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-4",
      title: "Projet 4",
      projectState: "Done",
      shortDesc: "Description courte du projet 4",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-5",
      title: "Projet 5",
      projectState: "Draft",
      shortDesc: "Description courte du projet 5",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-6",
      title: "Projet 6",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 6",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-7",
      title: "Projet 7",
      projectState: "Done",
      shortDesc: "Description courte du projet 7",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-8",
      title: "Projet 8",
      projectState: "Draft",
      shortDesc: "Description courte du projet 8",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-9",
      title: "Projet 9",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 9",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-10",
      title: "Projet 10",
      projectState: "Done",
      shortDesc: "Description courte du projet 10",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-1",
      title: "Projet 1",
      projectState: "Done",
      shortDesc: "Description courte du projet 1",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-2",
      title: "Projet 2",
      projectState: "Draft",
      shortDesc: "Description courte du projet 2",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-3",
      title: "Projet 3",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 3",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-4",
      title: "Projet 4",
      projectState: "Done",
      shortDesc: "Description courte du projet 4",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-5",
      title: "Projet 5",
      projectState: "Draft",
      shortDesc: "Description courte du projet 5",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-6",
      title: "Projet 6",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 6",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-7",
      title: "Projet 7",
      projectState: "Done",
      shortDesc: "Description courte du projet 7",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-8",
      title: "Projet 8",
      projectState: "Draft",
      shortDesc: "Description courte du projet 8",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-9",
      title: "Projet 9",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 9",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-10",
      title: "Projet 10",
      projectState: "Done",
      shortDesc: "Description courte du projet 10",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-1",
      title: "Projet 1",
      projectState: "Done",
      shortDesc: "Description courte du projet 1",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-2",
      title: "Projet 2",
      projectState: "Draft",
      shortDesc: "Description courte du projet 2",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-3",
      title: "Projet 3",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 3",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-4",
      title: "Projet 4",
      projectState: "Done",
      shortDesc: "Description courte du projet 4",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-5",
      title: "Projet 5",
      projectState: "Draft",
      shortDesc: "Description courte du projet 5",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-6",
      title: "Projet 6",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 6",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-7",
      title: "Projet 7",
      projectState: "Done",
      shortDesc: "Description courte du projet 7",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-8",
      title: "Projet 8",
      projectState: "Draft",
      shortDesc: "Description courte du projet 8",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-9",
      title: "Projet 9",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 9",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-10",
      title: "Projet 10",
      projectState: "Done",
      shortDesc: "Description courte du projet 10",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-1",
      title: "Projet 1",
      projectState: "Done",
      shortDesc: "Description courte du projet 1",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-2",
      title: "Projet 2",
      projectState: "Draft",
      shortDesc: "Description courte du projet 2",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-3",
      title: "Projet 3",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 3",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-4",
      title: "Projet 4",
      projectState: "Done",
      shortDesc: "Description courte du projet 4",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUbEmkBInE22Ri2OoJ9wRX8SGIvW1Ha3l3WAn-_eSV2PojipcoyrWkF-ZTsv68mbzSccc&usqp=CAU",
    },
    {
      skeleton: false,
      projectUrl: "projet-5",
      title: "Projet 5",
      projectState: "Draft",
      shortDesc: "Description courte du projet 5",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-6",
      title: "Projet 6",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 6",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-7",
      title: "Projet 7",
      projectState: "Done",
      shortDesc: "Description courte du projet 7",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-8",
      title: "Projet 8",
      projectState: "Draft",
      shortDesc: "Description courte du projet 8",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
    {
      skeleton: false,
      projectUrl: "projet-9",
      title: "Projet 9",
      projectState: "in Progress",
      shortDesc: "Description courte du projet 9",
      bgImage:
        "https://media.licdn.com/dms/image/C5103AQEGl16vH2V4Gg/profile-displayphoto-shrink_200_200/0/1566880663515?e=1694044800&v=beta&t=6w2Qdvc20fxXKkp1KK3TYFw7dEsmQdWJoMcD-EBRPWI",
    },
    {
      skeleton: false,
      projectUrl: "projet-10",
      title: "Projet 10",
      projectState: "Done",
      shortDesc: "Description courte du projet 10",
      bgImage: "https://destroykeaum.alwaysdata.net/assets/images/pp.jpg",
    },
  ];

  const [projectTrie, setProjectTrie] = useState("");

  //gere le changement de valeur du select
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectTrie(e.target.value);
  };

  const renderProjectTrie = () => {
    let result;
    switch (projectTrie) {
      // si option in-progress est selectionné, on range les projest dans l'ordre suivant: in progress, draft, done
      case "in-progress":
        result = projects.sort((a, b) => {
          if (a.projectState === "in Progress") {
            return -1;
          } else if (a.projectState === "Draft" && b.projectState === "Done") {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      // si option in-progress est selectionné, on range les projest dans l'ordre suivant: done , in progress, draft, done
      case "done":
        result = projects.sort((a, b) => {
          if (a.projectState === "Done") {
            return -1;
          } else if (
            a.projectState === "in Progress" &&
            b.projectState === "Draft"
          ) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      // si option in-progress est selectionné, on range les projest dans l'ordre suivant: in progress, draft, done
      case "draft":
        result = projects.sort((a, b) => {
          if (a.projectState === "Draft") {
            return -1;
          } else if (
            a.projectState === "in Progress" &&
            b.projectState === "Done"
          ) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      default:
        result = projects;
        break;
    }
    return result;
  };
  const sortedProjects = renderProjectTrie();

  return (
    <>
      <div className="m-10 pt-2">
        <div className="flex justify-between align-middle">
          <h2 className="mb-16 text-4xl font-bold">Recent Projects</h2>
          <select
            className="mr-10 h-9 rounded-lg border bg-transparent px-12 py-1 text-base font-semibold outline-0"
            value={projectTrie}
            onChange={handleOnChange}
          >
            <option value="" disabled selected hidden>
              trier par ...
            </option>
            <option className="text-base" value="in-progress">
              In progress
            </option>
            <option className="text-base" value="done">
              Done
            </option>
            <option className="text-base" value="draft">
              Draft
            </option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProjects.map((project) => (
            <Card
              key={project.projectUrl}
              skeleton={project.skeleton}
              projectUrl={project.projectUrl}
              title={project.title}
              projectState={project.projectState}
              shortDesc={project.shortDesc}
              bgImage={project.bgImage}
            />
          ))}
        </div>
      </div>
    </>
  );
};
