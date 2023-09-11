import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PenBox } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StepValidator } from "@/components/ui/stepValidator";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";
import { convertDateFromDateType } from "@/lib/utils";

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

      console.log(project.data);

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

      console.log(link, type);
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
    onError: (error: any) => {
      console.error(error);
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
              <FileCell
                title={drivesRushs.name || "Drive link"}
                link={drivesRushs.url}
                lastUpdate={drivesRushs.updated_at}
              />
            ) : (
              <NoFileCell />
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
            <NoFileCell />
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

const FileUpdateModal = ({
  isFileUpdateModalOpen,
  setIsFileUpdateModalOpen,
  type,
  mutation,
}: {
  isFileUpdateModalOpen: boolean;
  setIsFileUpdateModalOpen: (open: boolean) => void;
  type: string;
  mutation: any;
}) => {
  const [link, setLink] = useState("");

  return (
    <Dialog
      open={isFileUpdateModalOpen}
      onOpenChange={(open) => setIsFileUpdateModalOpen(open)}
    >
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Add a {type} link file</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center text-sera-jet">
          <label className="my-2 text-xl font-bold" htmlFor="link">
            Link
          </label>
          <input
            className="my-2 rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all hover:cursor-pointer hover:border-sera-jet/50 hover:text-sera-jet/50"
            type="text"
            name="link"
            id="link"
            placeholder={`Type the ${type} link here...`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Button
            className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            onClick={() => {
              if (link === "") return;
              mutation.mutate({ link, type });
            }}
          >
            Add the {type} link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FileCell = ({
  title,
  link,
  lastUpdate,
}: {
  title: string;
  link: string;
  lastUpdate: string;
}) => {
  return (
    <article className="mb-0 mt-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all hover:cursor-pointer hover:border-sera-jet/50 hover:text-sera-jet/50">
      <a href={link} target="_blank" rel="noreferrer">
        <p className="my-2 text-xl font-bold ">{title}</p>
        <p className="my-1 truncate text-lg ">{link}</p>
        <p className="my-2 text-right font-extralight italic">
          Last update : {convertDateFromDateType(new Date(lastUpdate))}
        </p>
      </a>
    </article>
  );
};

const NoFileCell = () => {
  return (
    <article className="mb-0 mt-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
      <p className="my-2 text-xl font-bold ">No file added</p>
      <p className="my-1 truncate text-lg ">
        You can add a file by clicking on the update button
      </p>
    </article>
  );
};
