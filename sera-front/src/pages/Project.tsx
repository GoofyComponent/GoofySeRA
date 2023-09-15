import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { MembersContainer } from "@/components/app/project/Members/MembersContainer";
import { SharedContainer } from "@/components/app/project/SharedRessources/SharedContainer";
import { StepsIndicatorContainer } from "@/components/app/project/StepsIndicator/StepsIndicatorContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  setLastSeenProjectId,
  setLastSeenProjectName,
} from "@/helpers/slices/AppSlice";
import { axios } from "@/lib/axios";
import { isReadyToPublish } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const Project = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [msgInfo, setMsgInfo] = useState("");
  const [publishIsPossible, setPublishIsPossible] = useState(false);
  const [type, setType] = useState<"publish" | "unpublish" | "">("");

  const {
    data: projectData,
    isLoading,
    isSuccess,
    refetch: projectRefetch,
  } = useQuery({
    queryKey: ["project", { id }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${id}`);
      return project.data;
    },
  });

  const { data: projectSteps, isLoading: ProjectStepLoading } = useQuery({
    queryKey: ["project-steps", { id }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${id}/steps`);
      return project.data;
    },
  });

  const publishProject = useMutation({
    mutationFn: async () => {
      const project = await axios.post(`/api/projects/${id}/publish`);
      return project.data;
    },
    onSuccess: () => {
      projectRefetch();
    },
  });

  const unPublishProject = useMutation({
    mutationFn: async () => {
      const project = await axios.post(`/api/projects/${id}/unpublish`);
      return project.data;
    },
    onSuccess: () => {
      projectRefetch();
    },
  });

  useEffect(() => {
    if (!projectSteps) return;

    const { isReady, msg } = isReadyToPublish(projectSteps);
    setMsgInfo(msg);
    setPublishIsPossible(isReady);
  }, [projectSteps]);

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

  if (isLoading || ProjectStepLoading)
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

          <TabsContent value="resume" className=" h-full text-sera-jet">
            <div className="flex h-full flex-col justify-around">
              <div className="flex justify-between">
                <div className="mr-2 flex w-1/2 flex-col">
                  <h3 className="text-3xl font-semibold">Project name :</h3>
                  <p className="text-normal mt-2">{projectData.title}</p>
                </div>
                <Separator className="h-[13em] w-0.5 bg-sera-jet" />
                <div className="ml-2 flex w-1/2 flex-col">
                  <h3 className="text-3xl font-semibold">Description :</h3>
                  <p className="text-normal mt-2">{projectData.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-semibold">What&apos;s next ?</h3>
                <p className="text-normal mt-2">{msgInfo}</p>
              </div>
              <div>
                <h3 className="text-3xl font-semibold">
                  Your project is ready ?
                </h3>
                <p className="text-normal mt-2">
                  All the steps are correct and your ready to distribute this
                  course ?
                </p>
                {projectData.status === "ongoing" && (
                  <Button
                    className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                    onClick={() => {
                      setType("publish");
                      setDialogOpen(true);
                    }}
                    disabled={publishIsPossible}
                  >
                    Publish this course
                  </Button>
                )}
                {projectData.status === "published" && (
                  <Button
                    className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                    onClick={() => {
                      setType("unpublish");
                      setDialogOpen(true);
                    }}
                    disabled={publishIsPossible}
                  >
                    Unpublish this course
                  </Button>
                )}
              </div>
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
      <Dialog
        onOpenChange={(value) => {
          if (value) return;
          setDialogOpen(false);
        }}
        open={dialogOpen}
      >
        {type === "publish" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish this course ?</DialogTitle>
              <DialogDescription>
                You course will be accessible in the catalog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                onClick={() => {
                  publishProject.mutate();
                  setDialogOpen(false);
                  setType("");
                }}
                disabled={publishProject.isLoading}
              >
                {publishProject.isLoading
                  ? "Publishing..."
                  : "I understand, publish this course."}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
        {type === "unpublish" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unpublish this course ?</DialogTitle>
              <DialogDescription>
                You course will be no longer accessible in the catalog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                onClick={() => {
                  unPublishProject.mutate();
                  setDialogOpen(false);
                  setType("");
                }}
                disabled={unPublishProject.isLoading}
              >
                {unPublishProject.isLoading
                  ? "Unpublishing..."
                  : "I understand, unpublish this course."}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
