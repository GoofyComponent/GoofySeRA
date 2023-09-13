import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { SharedContainer } from "@/components/app/project/SharedRessources/SharedContainer";
import { StepsIndicatorContainer } from "@/components/app/project/StepsIndicator/StepsIndicatorContainer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  setLastSeenProjectId,
  setLastSeenProjectName,
} from "@/helpers/slices/AppSlice";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Project = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

  const {
    data: projectData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["project", { id }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${id}`);
      return project.data;
    },
  });

  useEffect(() => {
    if (!searchParams.get("section")) {
      navigate(`/dashboard/projects/${id}?section=resume`);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && id && !isLoading && projectData) {
      dispatch(setLastSeenProjectId(id));
      dispatch(setLastSeenProjectName(projectData.title));
    }
  }, [isSuccess, id, projectData]);

  if (isLoading)
    return (
      <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
    );

  if (!projectData) return <>No project found</>;

  return (
    <>
      <HeaderTitle
        title={projectData.title && projectData.title}
        projectStatus={projectData.status && projectData.status}
        previousTitle="Projects"
        linkPath={`/dashboard/projects`}
      />
      <div className="flex justify-between">
        <Tabs
          className="ml-6 w-8/12"
          value={searchParams.get("section") || "resume"}
        >
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="resume"
              className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
              onClick={() =>
                navigate(`/dashboard/projects/${id}?section=resume`)
              }
            >
              Resume
            </TabsTrigger>
            <TabsTrigger
              value="ressources"
              className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
              onClick={() =>
                navigate(`/dashboard/projects/${id}?section=ressources`)
              }
            >
              Shared ressources
            </TabsTrigger>
            {projectData.team && (
              <TabsTrigger
                value="members"
                className="rounded-b-none rounded-t-sm text-xl data-[state=active]:bg-sera-jet data-[state=active]:text-sera-periwinkle"
                onClick={() =>
                  navigate(`/dashboard/projects/${id}?section=members`)
                }
              >
                Members
              </TabsTrigger>
            )}
          </TabsList>

          <Separator className="mb-2 h-0.5 w-full bg-sera-jet"></Separator>

          <TabsContent value="resume" className="text-sera-jet">
            <h3 className="mb-4 text-4xl font-medium text-sera-jet">
              Resume :
            </h3>
            <div className="flex justify-start">
              <h3 className="text-xl font-semibold">Project name :</h3>
              <p className="mt-auto">{projectData.title}</p>
            </div>
            <h3 className="text-xl font-semibold">Description :</h3>
            <p className="text-normal mt-2">{projectData.description}</p>
            <div>
              <h3 className="text-xl font-semibold">What&apos;s next ?</h3>
              <p className="text-normal mt-2">---------------------</p>
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
