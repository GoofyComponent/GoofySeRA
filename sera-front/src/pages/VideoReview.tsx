import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CheckSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { ChatContainer } from "@/components/app/videoReview/ChatContainer";
import { ReviewActions } from "@/components/app/videoReview/ReviewActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlyrSection } from "@/components/ui/plyrSection";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const VideoReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [activeVersion, setActiveVersion] = useState<string>(
    searchParams.get("version") || "0"
  );
  const [isPlanificationValid, setIsPlanificationValid] = useState(false);
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
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Post-Production`
      );
      return project.data[0].status;
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

      console.log("preSignedUrl", preSignedUrl);

      if (!preSignedUrl.data.url || !addVideoFile) return;

      if (!data.name || data.name === "") return;
      if (!data.description || data.description === "") return;
      if (!data.resolution || data.resolution === "") return;

      console.log("addVideoFile", addVideoFile);
      console.log("VideoFileType", addVideoFile?.type);

      const fileUpload = await axios.put(preSignedUrl.data.url, addVideoFile, {
        headers: {
          "Content-Type": `${addVideoFile?.type}`,
        },
      });

      if (!fileUpload) return;

      data.url = preSignedUrl.data.path;
      data.type = addVideoFile?.type;

      if (!data.url || data.url === "") return;

      console.log("dataaaaaaaaaaaaaaaa", data);

      const registerVideo = await axios.post(
        `/api/projects/${ProjectId}/videos`,
        data
      );

      console.log("registerVideo", registerVideo);

      /*       return project.data;
       */
    },
    onSuccess: () => {
      editingRefetch();
      setOpenAddVideo(false);
    },
    onError: (error) => {
      console.log(error);
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
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (projectStepIsSuccess) {
      projectStepStatus === "ongoing" && editingRefetch();
    }
  }, [projectStepIsSuccess]);

  useEffect(() => {
    console.log("activeVersion", activeVersion);
    navigate(`?version=${activeVersion}`);
  }, [activeVersion]);

  useEffect(() => {
    console.log("editingData", editingData);
    setIsPlanificationValid(false);
  }, [editingData]);

  if (
    (projectStepIsLoading && !projectStepIsSuccess) ||
    (editingIsLoading && !editingIsSuccess)
  )
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

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

        {!editingIsLoading && editingIsSuccess && (
          <ReviewActions
            editingData={editingData}
            activeVersion={activeVersion}
            setActiveVersion={setActiveVersion}
            setOpenAddVideo={setOpenAddVideo}
          />
        )}

        {editingData[activeVersion] && editingData[activeVersion].video && (
          <PlyrSection
            videoData={editingData[activeVersion].video}
            plyrRef={plyrRef}
          />
        )}

        {!editingData[activeVersion] && (
          <div className="aspect-video min-h-[10em] w-full">
            <div className="m-auto flex h-full w-9/12 flex-col justify-center rounded-lg bg-black/75 text-white">
              <p className="m-auto  text-center">Upload a video first.</p>
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

      <Dialog
        open={openAddVideo}
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setOpenAddVideo(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a video to review ?</DialogTitle>
            <DialogDescription>
              Add your edited video and the additonnal information to review it
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="video-name">Video name</Label>
            <Input
              type="text"
              placeholder="Video name"
              onChange={(e) => setAddedVideoName(e.target.value)}
              name="video-name"
            />
            <Label htmlFor="video-description">Video description</Label>
            <Input
              type="text"
              placeholder="Video description"
              onChange={(e) => setAddedVideoDescription(e.target.value)}
              name="video-description"
            />
            <Label htmlFor="video-resolution">Video resolution</Label>
            <Input
              type="text"
              placeholder="1080"
              onChange={(e) => setAddedVideoResolution(e.target.value)}
              name="video-resolution"
            />
            <Label htmlFor="video-file">Video file</Label>
            <Input
              type="file"
              placeholder="Video file"
              onChange={(e) => {
                if (e.target.files) {
                  setAddVideoFile(e.target.files[0]);
                }
              }}
              name="video-file"
              className="hover:cursor-pointer"
            />
            <Button
              onClick={() => {
                addVideoMutation.mutate();
              }}
              className="my-2 w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            >
              Add video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
