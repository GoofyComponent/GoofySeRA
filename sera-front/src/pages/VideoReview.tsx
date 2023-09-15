import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { NoUrlCell, UrlCell } from "@/components/app/capture/CaptureCells";
import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { AddVideoDialog } from "@/components/app/videoReview/AddDialog";
import { ChatContainer } from "@/components/app/videoReview/ChatContainer";
import { ReviewActions } from "@/components/app/videoReview/ReviewActions";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { PlyrSection } from "@/components/ui/plyrSection";
import { StepValidator } from "@/components/ui/stepValidator";
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";
import { accessManager } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const VideoReview = () => {
  const navigate = useNavigate();
  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );
  const [searchParams] = useSearchParams();
  const { ProjectId } = useParams<{ ProjectId: string }>();

  const [openRushsModal, setOpenRushsModal] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>(
    searchParams.get("version") || "0"
  );
  const [isEditingValid, setIsEditingValid] = useState(false);
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const addedVideoProvider = "html5";
  const addedVideoType = "video";
  const [addedVideoResolution, setAddedVideoResolution] = useState("");
  const [addedVideoName, setAddedVideoName] = useState("");
  const [addedVideoDescription, setAddedVideoDescription] = useState("");
  const [addVideoFile, setAddVideoFile] = useState<File | null>(null);

  const plyrRef = useRef(null);

  const {
    data: editingData,
    isLoading: editingIsLoading,
    isSuccess: editingIsSuccess,
    refetch: editingRefetch,
  } = useQuery({
    queryKey: ["editing", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${ProjectId}/videos`);
      setActiveVersion(searchParams.get("version") || "0");
      return project.data;
    },
  });

  const {
    data: projectStepStatus,
    isLoading: projectStepIsLoading,
    isSuccess: projectStepIsSuccess,
    refetch: projectStepRefetch,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Post-Production`
      );

      if (project.data[0].status === "not_started") {
        toast({
          title: "This step is no available for the moment !",
          description: `The video review step is not accessible a the moment. Please try again later.`,
        });
        return navigate(`/dashboard/projects/${ProjectId}`);
      }

      return project.data[0].status;
    },
  });

  const { data: drivesRushs } = useQuery({
    queryKey: ["drives-rushs", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${ProjectId}/get-rushs`);

      return project.data.ressource;
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async () => {
      const data: {
        provider: string;
        type: string;
        resolution: string;
        name: string;
        description: string;
        url?: string;
      } = {
        provider: addedVideoProvider,
        type: addedVideoType,
        resolution: addedVideoResolution,
        name: addedVideoName,
        description: addedVideoDescription,
      };

      const preSignedUrl = await axios.get(
        `api/projects/${ProjectId}/videos/getuploadurl`
      );

      if (!preSignedUrl.data.url || !addVideoFile) return;

      if (!data.name || data.name === "") return;
      if (!data.description || data.description === "") return;
      if (!data.resolution || data.resolution === "") return;

      const fileUpload = await axios.put(preSignedUrl.data.url, addVideoFile, {
        headers: {
          "Content-Type": `${addVideoFile?.type}`,
        },
      });

      if (!fileUpload) return;

      data.url = preSignedUrl.data.path;
      data.type = addVideoFile?.type;

      if (!data.url || data.url === "") return;

      const registerVideo = await axios.post(
        `/api/projects/${ProjectId}/videos`,
        data
      );

      return registerVideo.data;
    },
    onSuccess: () => {
      editingRefetch();
      setOpenAddVideo(false);
    },
  });

  const addComments = useMutation({
    mutationFn: async (data: any) => {
      const comments = await axios.post(
        `/api/projects/${ProjectId}/videos/${editingData[activeVersion].version}`,
        data
      );

      return comments.data;
    },
    onSuccess: () => {
      editingRefetch();
    },
  });

  const passToTranscription = useMutation({
    mutationFn: async () => {
      const moveStep = await axios.post(
        `/api/projects/${ProjectId}/validate/postproduction`,
        {
          version: editingData[activeVersion].version,
        }
      );
      return moveStep.data;
    },
    onSuccess: () => {
      projectStepRefetch();
      navigate(`/dashboard/projects/${ProjectId}`);
    },
  });

  useEffect(() => {
    if (projectStepIsSuccess) {
      projectStepStatus === "ongoing" && editingRefetch();
    }
  }, [projectStepIsSuccess]);

  useEffect(() => {
    navigate(`?version=${activeVersion}`);
  }, [activeVersion]);

  useEffect(() => {
    if (!editingData) return;
    if (editingData.length === 0) return;
    setIsEditingValid(true);
  }, [editingData]);

  if (projectStepIsLoading)
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  if (
    (projectStepIsLoading && !projectStepIsSuccess) ||
    (editingIsLoading && !editingIsSuccess)
  )
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  return (
    <div className="flex justify-start">
      <section className="w-2/3">
        <HeaderTitle
          title="Review vidéo"
          previousTitle={lastSeenProjectName}
          linkPath={`/dashboard/projects/${ProjectId}`}
        />

        {accessManager(undefined, "validate_project_step") && (
          <div className="mx-auto w-11/12">
            <StepValidator
              projectStepStatus={projectStepStatus}
              isprojectStatusLoading={projectStepIsLoading}
              isprojectStatusSuccess={projectStepIsSuccess}
              isCurrentStepValid={isEditingValid}
              mutationMethod={passToTranscription}
              cannotValidateMessage="You can't validate this step until your validate one version of the video"
              validateAvertissement="You gonna validate the current edit your display on the player."
              buttonMessage="Validate this version"
            />
          </div>
        )}

        {projectStepStatus !== "done" && (
          <>
            {!editingIsLoading && editingIsSuccess && (
              <ReviewActions
                editingData={editingData}
                setActiveVersion={setActiveVersion}
                setOpenAddVideo={setOpenAddVideo}
              />
            )}
          </>
        )}

        {editingData[activeVersion] && editingData[activeVersion].video && (
          <PlyrSection
            videoData={editingData[activeVersion].video}
            plyrRef={plyrRef}
          />
        )}

        {editingData[activeVersion] && editingData[activeVersion].video && (
          <button
            className="text-md mx-auto w-full text-center italic underline hover:cursor-pointer hover:opacity-70"
            onClick={() => {
              setOpenRushsModal(true);
            }}
          >
            Get rushs link {">>>>>>>>"}
          </button>
        )}

        {!editingData[activeVersion] && (
          <div className="aspect-video min-h-[10em] w-full">
            <div className="m-auto flex h-full w-9/12 flex-col justify-center rounded-lg bg-black/75 text-white">
              <p className="m-auto  text-center">Upload a video first.</p>
              <button
                className="text-md mx-auto text-center italic underline hover:cursor-pointer hover:opacity-70"
                onClick={() => {
                  setOpenRushsModal(true);
                }}
              >
                Get rushs link {">>>>>>>>"}
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="my-2 ml-4 min-h-full w-1/3 overflow-hidden rounded-l-3xl bg-sera-periwinkle/40 py-3">
        <ChatContainer
          currentVideo={editingData[activeVersion]}
          plyrRef={plyrRef}
          addCommentsMutation={addComments}
        />
      </section>

      <AddVideoDialog
        openAddVideo={openAddVideo}
        addedVideoName={addedVideoName}
        addedVideoDescription={addedVideoDescription}
        addedVideoResolution={addedVideoResolution}
        addVideoFile={addVideoFile}
        setOpenAddVideo={setOpenAddVideo}
        setAddedVideoName={setAddedVideoName}
        setAddedVideoDescription={setAddedVideoDescription}
        setAddedVideoResolution={setAddedVideoResolution}
        setAddVideoFile={setAddVideoFile}
        addVideoMutation={addVideoMutation}
      />

      <Dialog
        open={openRushsModal}
        onOpenChange={(value) => {
          if (value) return;
          setOpenRushsModal(false);
        }}
      >
        <DialogContent className="">
          <DialogHeader>Rush link :</DialogHeader>
          <div className="w-11/12">
            {drivesRushs && drivesRushs.url ? (
              <UrlCell
                title={drivesRushs.name || "Drive link"}
                link={drivesRushs.url}
                lastUpdate={drivesRushs.updated_at}
              />
            ) : (
              <NoUrlCell />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
