import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CheckSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import srtParser2 from "srt-parser-2";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
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
import { RaptorPlyr } from "@/components/ui/plyrSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { axios } from "@/lib/axios";
import { SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const Transcription = () => {
  const parser = new srtParser2();

  const { ProjectId } = useParams<{ ProjectId: string }>();
  const plyrRef = useRef<any>(null);

  const [isTranscriptValid, setIsTranscriptValid] = useState(false);
  const [displayedLine, setDisplayedLine] = useState("");
  const [addFileModal, setAddFileModal] = useState(false);
  const [subtiltleFileSubmitted, setSubtiltleFileSubmitted] =
    useState<File | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [srtArray, setSrtArray] = useState<any>([]);

  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    refetch: refetchTranscript,
  } = useQuery({
    queryKey: ["project-transcript", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/transcriptions`
      );

      if (!project.data.data) return [];
      let formatedData;
      // Transform the object into an array
      if (Array.isArray(project.data.data)) {
        formatedData = project.data.data;
      } else {
        formatedData = Object.keys(project.data.data).map((key) => {
          return project.data.data[key];
        });
      }

      setSelectedVersion(formatedData[formatedData.length - 1]);

      return formatedData;
    },
  });

  const getFile = useQuery({
    queryKey: ["project-transcript-file"],
    queryFn: async () => {
      if (!selectedVersion) return;
      const file = await axios.get(selectedVersion.srt.ressource.url);
      return file.data;
    },
    enabled: false,
  });

  const addSubtitleFile = useMutation({
    mutationFn: async () => {
      if (!subtiltleFileSubmitted) return;
      const filename = subtiltleFileSubmitted.name;

      if (!filename.endsWith(".srt") && !filename.endsWith(".vtt")) return;

      const formData = new FormData();
      if (filename.endsWith(".vtt")) {
        formData.append("vtt", subtiltleFileSubmitted);
      }

      if (filename.endsWith(".srt")) {
        formData.append("srt", subtiltleFileSubmitted);
      }

      const response = await axios.post(
        `/api/projects/${ProjectId}/transcriptions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      refetchTranscript();
      setSubtiltleFileSubmitted(null);
      setAddFileModal(false);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    if (!getFile.data) return;
    setSrtArray(parser.fromSrt(getFile.data));
  }, [getFile.data]);

  useEffect(() => {
    //Fetch subtitle file content
    if (!selectedVersion) return;
    getFile.refetch();
  }, [selectedVersion]);

  useEffect(() => {
    setIsTranscriptValid(false);
    if (plyrRef.current?.plyr.source === null) return;
    const mySubtitles = srtArray;

    const setCurrentLine = () => {
      if (!mySubtitles || mySubtitles.length === 0) return;
      const currentTime = plyrRef.current?.plyr.currentTime;

      const currentLine = mySubtitles.find(
        (objet: any) =>
          currentTime >= objet.startSeconds && currentTime <= objet.endSeconds
      );

      if (currentLine) {
        setDisplayedLine(currentLine.text);
      } else {
        setDisplayedLine("");
      }
    };

    plyrRef.current?.plyr.on("timeupdate", setCurrentLine);

    const offFuncs = () => {
      plyrRef.current?.plyr.off("timeupdate", setCurrentLine);
    };

    if (plyrRef?.current?.plyr?.source) {
      return offFuncs;
    }
  }, [plyrRef, plyrRef.current, srtArray]);

  const {
    data: projectStepStatus,
    isLoading: isStepStatusLoading,
    isSuccess: isStepStatusSuccess,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Planning`
      );
      return project.data[0].status;
    },
  });

  if (isTranscriptLoading && isStepStatusLoading)
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  return (
    <>
      <HeaderTitle title="Transcription" previousTitle="Projet" />
      <div className="mx-6 flex justify-between">
        <section className="flex w-1/2 flex-col justify-evenly">
          <div className="flex flex-col justify-end">
            {isStepStatusLoading && !isStepStatusSuccess && (
              <p className="text-center italic">Loading...</p>
            )}
            {projectStepStatus != "done" && isStepStatusSuccess && (
              <>
                <Button
                  className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                  disabled={!isTranscriptValid}
                  onClick={() => {
                    if (isTranscriptValid) {
                      console.log("isTranscriptValid");
                    }
                  }}
                >
                  <Check />
                  <p className="ml-2">Validate this step</p>
                </Button>
                {!isTranscriptValid && (
                  <p className="my-auto text-gray-600">
                    You can&apos;t validate this step until your team is
                    complete and you have at least one reservation.
                  </p>
                )}
              </>
            )}
            {projectStepStatus === "done" && isStepStatusSuccess && (
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
          <h3 className="mb-2 mt-0 text-4xl font-medium text-sera-jet">
            Transcript file :
          </h3>
          {transcriptData && transcriptData.length > 0 ? (
            <TranscriptFileCell
              selectedVersion={selectedVersion}
              transcriptData={transcriptData}
              setAddFileModal={setAddFileModal}
              setSelectedVersion={setSelectedVersion}
            />
          ) : (
            <NoTranscriptFileCell setAddFileModal={setAddFileModal} />
          )}
        </section>
        <section className="my-auto w-1/2 px-2">
          <div
            className="mx-auto aspect-video w-9/12 overflow-hidden rounded-lg"
            style={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              "--plyr-color-main": SERA_JET_HEXA,
              "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
            }}
          >
            <RaptorPlyr
              ref={plyrRef}
              source={videoData}
              className="aspect-video"
            />
          </div>
        </section>
      </div>
      <Separator className="mx-auto my-4 h-0.5 w-11/12 bg-sera-jet/75" />
      <section id="srt-checker" className="mx-6">
        <h3 className="my-2 text-4xl font-medium text-sera-jet">
          SRT Viewer :
        </h3>

        <p className="my-auto w-full select-none text-center text-7xl font-bold text-sera-jet">
          {displayedLine}
        </p>
      </section>
      <Dialog
        open={addFileModal}
        onOpenChange={(open) => setAddFileModal(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a transcript file</DialogTitle>
            <DialogDescription>
              Submit a .SRT or .VTT file to add a transcript file. The file will
              be automatically converted to the other format.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="subtitle_file">
              Select your .SRT or .VTT file:
            </Label>
            <Input
              id="subtitle_file"
              type="file"
              className="my-2"
              accept=".srt,.vtt"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                if (!file) return;
                setSubtiltleFileSubmitted(file);
              }}
            />
            <Button
              className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              disabled={!subtiltleFileSubmitted}
              onClick={() => {
                if (!subtiltleFileSubmitted) return;
                addSubtitleFile.mutate();
              }}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TranscriptFileCell = ({
  selectedVersion,
  transcriptData,
  setAddFileModal,
  setSelectedVersion,
}: {
  selectedVersion: any;
  transcriptData: any;
  setAddFileModal: (value: boolean) => void;
  setSelectedVersion: (value: any) => void;
}) => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-1 text-sera-jet">
      <div className="flex justify-between pb-2">
        <p className="my-2 text-xl font-bold ">Select a version</p>
        <button
          className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => setAddFileModal(true)}
        >
          Upload a new SRT file
        </button>
      </div>

      <Select
        defaultValue={transcriptData[transcriptData.length - 1].srt.version}
        name="Transcript File Version"
        value={selectedVersion.srt.version}
        onValueChange={(value) => {
          const version = transcriptData.find(
            (version: any) => version.srt.version === value
          );
          if (version) {
            setSelectedVersion(version);
          }
        }}
      >
        <SelectTrigger className="mb-1">
          <SelectValue placeholder="Select a file" />
        </SelectTrigger>
        <SelectContent>
          {transcriptData.map((version: any) => (
            <SelectItem key={version.srt.version} value={version.srt.version}>
              Version {version.srt.version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <p>You are seeing transcript file version 3</p>
        <p className="font-extralight italic">
          Uploaded on 2021-05-03 at 15:30 by John Doe
        </p>
      </div>
    </article>
  );
};

const NoTranscriptFileCell = ({
  setAddFileModal,
}: {
  setAddFileModal: (value: boolean) => void;
}) => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
      <div className="flex justify-between pb-2">
        <p className="my-2 text-xl font-bold ">No file added</p>
        <button
          className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => setAddFileModal(true)}
        >
          Upload a new SRT file
        </button>
      </div>

      <p className="my-1 truncate text-lg ">
        You can add a file by clicking on the upload button
      </p>
    </article>
  );
};

const videoData = {
  type: "video",
  title: "bunny",
  sources: [
    {
      size: 1080,
      provider: "html5",
      src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
    },
  ],
};
