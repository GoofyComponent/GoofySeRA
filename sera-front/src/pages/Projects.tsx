import { Card } from "@/components/ui/card";

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

  return (
    <div className="m-10 pt-2">
      <h2 className="mb-16 text-4xl font-bold">Recent Projects</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.reverse().map((project) => (
          <Card
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
  );
};