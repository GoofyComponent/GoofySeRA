import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PenBox } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { NoUrlCell, UrlCell } from "@/components/app/capture/CaptureCells";
import { FileUpdateModal } from "@/components/app/capture/CaptureModals";
import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import { StepValidator } from "@/components/ui/stepValidator";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Capture = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { ProjectId } = useParams<{ ProjectId: string }>();

  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );

  const [isPlanificationValid, setIsPlanificationValid] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [notesIsLocked, setNotesIsLocked] = useState(false);
  const [isFileUpdateModalOpen, setIsFileUpdateModalOpen] = useState(false);
  const [fileUpdateModalType, setFileUpdateModalType] = useState("");

  const {
    data: projectStep,
    isLoading,
    isSuccess,
    refetch: refetchProjectStep,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Capture`
      );

      return project.data[0];
    },
  });

  const { data: drivesRushs, isLoading: rushsQueryLoading } = useQuery({
    queryKey: ["drives-rushs", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${ProjectId}/get-rushs`);

      if (project.data.ressource.url) {
        setIsPlanificationValid(true);
      } else {
        setIsPlanificationValid(false);
      }

      return project.data.ressource;
    },
  });

  const addVideoRushsDrive = useMutation({
    mutationFn: async ({ link, type }: { link: string; type: string }) => {
      let call;
      if (type === "videos rushs")
        call = await axios.post(`/api/projects/${ProjectId}/add-rushs`, {
          link,
        });

      return call;
    },
    onSuccess: () => {
      refetchProjectStep();
      queryClient.invalidateQueries(["drives-rushs", { ProjectId }]);

      setIsFileUpdateModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const validateStep = useMutation({
    mutationFn: async () => {
      const project = await axios.post(
        `/api/projects/${ProjectId}/captation-to-postproduction`
      );

      return project;
    },
    onSuccess: () => {
      refetchProjectStep();
      navigate(`/dashboard/projects/${ProjectId}/editing`);
    },
  });

  if (isLoading && !isSuccess && rushsQueryLoading)
    return <BigLoader bgColor="#F3F4F6" textColor="sera-jet" />;

  return (
    <>
      <HeaderTitle title="Capture" previousTitle={lastSeenProjectName} />

      <div className="mx-6">
        <StepValidator
          projectStepStatus={projectStep.status}
          isprojectStatusLoading={isLoading}
          isprojectStatusSuccess={isSuccess}
          isCurrentStepValid={isPlanificationValid}
          mutationMethod={validateStep}
          cannotValidateMessage="You can't validate this step until you set one video rushs drive"
          buttonMessage="Validate this step"
        />
      </div>

      <div id="capture" className="mx-6">
        <div className="flex justify-between">
          <section id="planification-team" className="mx-2 w-5/12">
            <div className=" my-2 flex justify-between">
              <h3 className="my-4 text-4xl font-medium text-sera-jet">
                Video rush drive
              </h3>
              <PenBox
                size={32}
                className="my-auto text-sera-jet transition-all hover:cursor-pointer hover:text-sera-jet/50"
                onClick={() => {
                  setFileUpdateModalType("videos rushs");
                  setIsFileUpdateModalOpen(true);
                }}
              />
            </div>
            {drivesRushs && drivesRushs.url ? (
              <UrlCell
                title={drivesRushs.name || "Drive link"}
                link={drivesRushs.url}
                lastUpdate={drivesRushs.updated_at}
              />
            ) : (
              <NoUrlCell />
            )}
          </section>
          <section id="rooms-container" className="mx-2 w-5/12">
            <div className="my-2 flex justify-between">
              <h3 className="my-4 text-4xl font-medium text-sera-jet">
                Professor notes <span className="text-xl">(optional)</span>
              </h3>
              <PenBox
                size={32}
                className="my-auto text-sera-jet transition-all hover:cursor-pointer hover:text-sera-jet/50"
                onClick={() => {
                  setFileUpdateModalType("professor notes");
                  setIsFileUpdateModalOpen(true);
                }}
              />
            </div>
            {/* SAMPLE DATA */}
            <NoUrlCell />
          </section>
        </div>
        <section className="w-full">
          <h3 className="my-4 text-4xl font-medium text-sera-jet">
            Shooting notes <span className="text-xl">(optional)</span>
          </h3>
          {/* SAMPLE DATA */}
          <Textarea
            placeholder="Type some shooting notes..."
            className="my-2 min-h-[20rem]"
            disabled={notesIsLocked}
            value={notes ? notes : ""}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            onClick={() => {
              setNotesIsLocked(!notesIsLocked);
            }}
          >
            Lock the notes
          </Button>
        </section>

        <FileUpdateModal
          isFileUpdateModalOpen={isFileUpdateModalOpen}
          setIsFileUpdateModalOpen={setIsFileUpdateModalOpen}
          type={fileUpdateModalType}
          mutation={addVideoRushsDrive}
        />
      </div>
    </>
  );
};
