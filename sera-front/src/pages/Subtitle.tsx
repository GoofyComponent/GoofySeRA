import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import srtParser2 from "srt-parser-2";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { NoSubtitleCell } from "@/components/app/subtitle/NoSubtitleCell";
import { SubtitleSelectCell } from "@/components/app/subtitle/SubtitleSelectCell";
import { Button } from "@/components/ui/button";
import { RaptorPlyr } from "@/components/ui/plyrSection";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";
import { SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

export const Subtitle = () => {
  const parser = new srtParser2();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );
  const plyrRef = useRef<any>(null);
  const selectedLanguage = searchParams.get("lang");

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [srtArray, setSrtArray] = useState<any>(null);
  const [displayedLine, setDisplayedLine] = useState("");

  useEffect(() => {
    projectStepStatus.refetch();
  }, []);

  const { data: subtitleData, isSuccess: isSubtitleSuccess } = useQuery({
    queryKey: ["subtitle", { ProjectId, selectedLanguage }],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/${ProjectId}/subtitles`);
      return response.data.subtitles;
    },
  });

  const { data: validatedVideoData } = useQuery({
    queryKey: ["project-video", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/videos/validated`
      );
      return project.data;
    },
  });

  const getFile = useQuery({
    queryKey: ["project-subtitle-file"],
    queryFn: async () => {
      if (!selectedFile) return;
      const file = await axios.get(selectedFile.srt.ressource.url);
      return file.data;
    },
    enabled: false,
  });

  const getTranscription = useQuery({
    queryKey: ["project-transcript-file", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/transcriptions?final=1`
      );
      const srtObject = project.data.data.find(
        (item: any) => item.file_type === "srt"
      );

      if (!srtObject) throw new Error("No transcription file");

      const file = await axios.get(srtObject.ressource.url);

      //Download the file
      const blob = new Blob([file.data], { type: "text/srt" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = srtObject.ressource.name;
      link.click();
      link.remove();

      return file.data;
    },
    enabled: false,
  });

  const projectStepStatus = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Subtitling`
      );

      if (project.data[0].status === "not_started") {
        toast({
          title: "This step is no available for the moment !",
          description: `The transcription step is not accessible a the moment. Please try again later.`,
        });
        return navigate(`/dashboard/projects/${ProjectId}`);
      }

      return project.data[0].status;
    },
    enabled: false,
  });

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
  }, [
    plyrRef && plyrRef.current,
    srtArray,
    validatedVideoData,
    searchParams.get("lang"),
  ]);

  useEffect(() => {
    if (!selectedLanguage) {
      navigate(`/dashboard/projects/${ProjectId}/subs?lang=en`);
    }

    if (subtitleData && selectedLanguage) {
      const selectedVersion = subtitleData[selectedLanguage];
      if (selectedVersion) {
        setSelectedFile(selectedVersion);
      }
    }
  }, [selectedLanguage, subtitleData]);

  useEffect(() => {
    if (!getFile.data) return;
    setSrtArray(parser.fromSrt(getFile.data));
  }, [getFile.data]);

  useEffect(() => {
    if (!selectedFile) return;
    getFile.refetch();
  }, [selectedFile]);

  const downloadVideo = async () => {
    if (
      !validatedVideoData ||
      !validatedVideoData.video ||
      !validatedVideoData.video.json
    ) {
      return;
    }

    const videoUrl = validatedVideoData.video.json.sources[0].src;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  if (projectStepStatus.isLoading)
    return <BigLoader bgColor="transparent" textColor="sera-jet" />;

  return (
    <>
      <HeaderTitle
        title="Subtitle"
        previousTitle={lastSeenProjectName}
        linkPath={`/dashboard/projects/${ProjectId}`}
      />
      <div className="mx-6 flex justify-between">
        <section className="flex w-1/2 flex-col justify-evenly">
          <h3 className="mb-2 mt-0 text-4xl font-medium text-sera-jet">
            Subtitle language :
          </h3>
          {subtitleData && isSubtitleSuccess && (
            <SubtitleSelectCell subtitleData={subtitleData} />
          )}
          {!subtitleData && isSubtitleSuccess && <NoSubtitleCell />}
        </section>
        <section className="my-auto w-1/2 px-2">
          {srtArray && validatedVideoData && (
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
                source={validatedVideoData.video.json}
                className="aspect-video"
              />
            </div>
          )}
          <div className="mt-2 flex justify-end">
            <Button
              onClick={downloadVideo}
              className="my-auto mr-8 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            >
              <Download size={20} className="mr-2" />
              Download
            </Button>
          </div>
        </section>
      </div>
      <Separator className="mx-auto my-4 h-0.5 w-11/12 bg-sera-jet/75" />
      <section id="srt-checker" className="mx-6">
        <div className="flex justify-between">
          <h3 className="my-2 text-4xl font-medium text-sera-jet">
            Currently viewing &quot;{selectedLanguage?.toUpperCase()}&quot;
            subtitle
          </h3>
          <Button
            className="my-auto bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            onClick={() => {
              getTranscription.refetch();
            }}
          >
            Download transcript file <Download size={24} className="ml-2" />
          </Button>
        </div>

        <p className="my-auto w-full select-none text-center text-7xl font-bold text-sera-jet">
          {displayedLine}
          {plyrRef && plyrRef.current && plyrRef.current?.plyr.source
            ? ""
            : "Select a language"}
        </p>
      </section>
    </>
  );
};
