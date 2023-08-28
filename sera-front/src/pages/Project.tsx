import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { SharedContainer } from "@/components/app/project/SharedRessources/SharedContainer";
import { StepsIndicatorContainer } from "@/components/app/project/StepsIndicator/StepsIndicatorContainer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Project = () => {
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

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

  if (error) return <> Erreur </>;

  if (isLoading)
    return (
      <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
    );

  if (!projectData) return <>No project found</>;

  return (
    <>
      <HeaderTitle
        title={projectData.title && projectData.title}
        previousTitle="Projet"
      />
      <div className="flex justify-between">
        <Tabs defaultValue="resume" className="ml-6 w-8/12">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="resume"
              className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
            >
              Résumé
            </TabsTrigger>
            <TabsTrigger
              value="ressources"
              className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
            >
              Ressources partagées
            </TabsTrigger>
            {projectData.team && (
              <TabsTrigger
                value="members"
                className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
              >
                Membres
              </TabsTrigger>
            )}
          </TabsList>

          <Separator className="mb-2 h-0.5 w-full bg-sera-jet"></Separator>

          <TabsContent value="resume">
            <div className="flex justify-start">
              <h3 className="text-xl font-semibold">Project name :</h3>
              <p className="mt-auto">{projectData.title}</p>
            </div>
            <h3 className="text-xl font-semibold">Description :</h3>
            <p className="text-normal mt-2">{projectData.description}</p>
            <div>
              <h3 className="text-xl font-semibold">What&apos;s next ?</h3>
              <p className="text-normal mt-2">
                BLABLABLA VOUS DEVEZ ENCORE FAIRE CA POUR VALIDERR LETAPE
              </p>
            </div>
          </TabsContent>
          <TabsContent value="ressources">
            <SharedContainer />
          </TabsContent>
          <TabsContent value="members" className="text-sera-jet">
            <section id="project-team">
              <MembersContainer />
            </section>
          </TabsContent>
        </Tabs>

        <StepsIndicatorContainer />
      </div>
    </>
  );
};
