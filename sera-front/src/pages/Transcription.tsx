import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import srtParser2 from "srt-parser-2";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import {
  NoTranscriptFileCell,
  TranscriptFileCell,
} from "@/components/app/transcription/TranscriptCell";
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
import { Separator } from "@/components/ui/separator";
import { StepValidator } from "@/components/ui/stepValidator";
import { axios } from "@/lib/axios";
import { SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const Transcription = () => {
  const parser = new srtParser2();
  const navigate = useNavigate();

  const { ProjectId } = useParams<{ ProjectId: string }>();
  const plyrRef = useRef<any>(null);

  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );

  const [isTranscriptValid, setIsTranscriptValid] = useState(false);
  const [displayedLine, setDisplayedLine] = useState("");
  const [addFileModal, setAddFileModal] = useState(false);
  const [subtiltleFileSubmitted, setSubtiltleFileSubmitted] =
    useState<File | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [srtArray, setSrtArray] = useState<any>([]);
  const [plyrSourceObject, setPlyrSourceObject] = useState<any>(null);

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

  const { data: validatedVideoData, isLoading: validatedVideoIsLoading } =
    useQuery({
      queryKey: ["project-video", { ProjectId }],
      queryFn: async () => {
        const project = await axios.get(
          `/api/projects/${ProjectId}/videos/validated`
        );
        return project.data;
      },
    });

  const {
    data: projectStepStatus,
    isLoading: isStepStatusLoading,
    isSuccess: isStepStatusSuccess,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Transcription`
      );
      return project.data[0].status;
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
  });

  const validateStep = useMutation({
    mutationFn: async () => {
      const project = await axios.post(
        `/api/projects/${ProjectId}/validate/transcription`,
        {
          version: selectedVersion.srt.version,
        }
      );

      return project;
    },
    onSuccess: () => {
      refetchTranscript();
      navigate(`/dashboard/projects/${ProjectId}`);
    },
  });

  useEffect(() => {
    if (
      !validatedVideoData ||
      !validatedVideoData.video ||
      !validatedVideoData.video.json
    )
      return;
    if (!selectedVersion || !selectedVersion.vtt.ressource.url) return;

    getFile.refetch();

    const plyrSourceObject = validatedVideoData.video.json;
    plyrSourceObject.tracks = [
      {
        kind: "captions",
        label: "VO",
        srclang: "vo",
        src: selectedVersion.vtt.ressource.url,
      },
    ];

    setPlyrSourceObject(plyrSourceObject);
  }, [selectedVersion, validatedVideoData]);

  useEffect(() => {
    if (!getFile.data) return;
    setSrtArray(parser.fromSrt(getFile.data));
  }, [getFile.data]);

  useEffect(() => {
    if (!selectedVersion) return;

    if (selectedVersion.srt && selectedVersion.srt.ressource) {
      setIsTranscriptValid(true);
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (plyrRef.current?.plyr.source === null || srtArray === null) return;
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
  }, [plyrRef && plyrRef.current, srtArray]);

  if (isTranscriptLoading && isStepStatusLoading && validatedVideoIsLoading)
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  return (
    <>
      <HeaderTitle
        title="Transcription"
        previousTitle={lastSeenProjectName}
        linkPath={`/dashboard/projects/${ProjectId}`}
      />
      <div className="mx-6 flex justify-between">
        <section className="flex w-1/2 flex-col justify-evenly">
          <StepValidator
            projectStepStatus={projectStepStatus}
            isprojectStatusLoading={isStepStatusLoading}
            isprojectStatusSuccess={isStepStatusSuccess}
            isCurrentStepValid={isTranscriptValid}
            mutationMethod={validateStep}
            buttonMessage="Validate this step"
            cannotValidateMessage="You can't validate this step until you have at least one transcription file."
            validateAvertissement="You are about to validate the file currently selected. You won't be able to modify it after validation."
          />

          <h3 className="mb-2 mt-0 text-4xl font-medium text-sera-jet">
            Transcript file :
          </h3>
          {selectedVersion &&
          selectedVersion.srt &&
          transcriptData &&
          transcriptData.length > 0 ? (
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
          <p className="text-center text-sm font-extralight italic">
            The subtitle displayed on the player is the latest uploaded version.
          </p>
          {plyrSourceObject && (
            <div
              className="mx-auto aspect-video w-11/12 overflow-hidden rounded-lg"
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                "--plyr-color-main": SERA_JET_HEXA,
                "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
              }}
            >
              <RaptorPlyr
                ref={plyrRef}
                source={plyrSourceObject || validatedVideoData.video.json}
                className="aspect-video"
              />
            </div>
          )}
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
              {!addSubtitleFile.isLoading && <p>Submit</p>}
              {addSubtitleFile.isLoading && (
                <div className="flex justify-center">
                  <BigLoader
                    bgColor="transparent"
                    textColor="sera-periwinkle"
                  />
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
