import { useQuery } from "@tanstack/react-query";
import { Check, CheckSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { ChatContainer } from "@/components/app/videoReview/ChatContainer";
import { PlyrSection } from "@/components/app/videoReview/PlyrSection";
import { ReviewActions } from "@/components/app/videoReview/ReviewActions";
import { Button } from "@/components/ui/button";
import mockVideoReview from "@/helpers/fakeData/mockVideoReview.json";
import { axios } from "@/lib/axios";

export const VideoReview = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [activeVersion, setActiveVersion] = useState(mockVideoReview[0]);
  const [isPlanificationValid, setIsPlanificationValid] = useState(false);

  const plyrRef = useRef(null);

  const {
    data: editingData,
    /*     isLoading: editingIsLoading,
    isSuccess: editingIsSuccess, */
    refetch: editingRefetch,
  } = useQuery({
    queryKey: ["editing", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/video-reviews`
      );
      return project.data;
    },
    enabled: false,
  });

  const {
    data: projectStepStatus,
    isLoading: projectStepIsLoading,
    isSuccess: projectStepIsSuccess,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Post-Production`
      );
      return project.data[0].status;
    },
  });

  useEffect(() => {
    if (projectStepIsSuccess) {
      projectStepStatus === "ongoing" && editingRefetch();
    }
  }, [projectStepIsSuccess]);

  useEffect(() => {
    console.log(editingData);
    setIsPlanificationValid(false);
  }, [editingData]);

  if (projectStepIsLoading && !projectStepIsSuccess)
    return <p className="text-center italic">Loading...</p>;

  /* if (editingIsLoading && !editingIsSuccess)
    return <p className="text-center italic">Loading...</p>; */

  return (
    <div className="flex justify-start">
      <section className="w-2/3">
        <HeaderTitle title="Review vidéo" previousTitle="Projet" />
        <div className="mx-6 flex flex-col justify-end">
          {projectStepIsLoading && !projectStepIsSuccess && (
            <p className="text-center italic">Loading...</p>
          )}
          {projectStepStatus != "done" && projectStepIsSuccess && (
            <>
              <Button
                className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                disabled={!isPlanificationValid}
                onClick={() => {
                  if (isPlanificationValid) {
                    console.log("passToCaptation");
                  }
                }}
              >
                <Check />
                <p className="ml-2">Validate this step</p>
              </Button>
              {!isPlanificationValid && (
                <p className="my-auto text-gray-600">
                  You can&apos;t validate this step until your validate one
                  version of the video
                </p>
              )}
            </>
          )}
          {projectStepStatus === "done" && projectStepIsSuccess && (
            <div className="my-auto flex justify-center rounded-lg border-2 border-sera-jet text-center text-sera-jet">
              <CheckSquare size={32} className="my-auto mr-4" />
              <div className="flex flex-col justify-center text-center">
                <p className="font-bold">This step has been validated.</p>
                <p className="font-extralight italic">
                  You can still update the information
                </p>
              </div>
            </div>
          )}
        </div>

        <ReviewActions
          reviewData={mockVideoReview}
          activeVersion={activeVersion}
          setActiveVersion={setActiveVersion}
        />

        <PlyrSection videoData={activeVersion.video} plyrRef={plyrRef} />
      </section>
      <section className="my-2 ml-4 min-h-full w-1/3 rounded-l-3xl bg-sera-periwinkle/40 py-3">
        <ChatContainer chatData={activeVersion.comments} plyrRef={plyrRef} />
      </section>
    </div>
  );
};
