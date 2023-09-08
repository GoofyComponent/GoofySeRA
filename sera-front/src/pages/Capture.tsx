import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CheckSquare, PenBox } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";

import { BigLoader } from "./skeletons/BigLoader";

export const Capture = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
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

      if (project.data[0].link === null) {
        setIsPlanificationValid(false);
      } else {
        setIsPlanificationValid(true);
      }

      return project.data[0];
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
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  if (isLoading && !isSuccess)
    return <BigLoader bgColor="#F3F4F6" textColor="sera-jet" />;

  return (
    <>
      <HeaderTitle title="Capture" previousTitle="Projet" />
      <div className="mx-6 flex flex-col justify-end">
        {isLoading && !isSuccess && (
          <p className="text-center italic">Loading...</p>
        )}
        {projectStep.status != "done" && isSuccess && (
          <>
            <Button
              className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              disabled={!isPlanificationValid}
              onClick={() => {
                if (isPlanificationValid) {
                  console.log("ValidTheStep");
                }
              }}
            >
              <Check />
              <p className="ml-2">Validate this step</p>
            </Button>
            {!isPlanificationValid && (
              <p className="my-auto text-gray-600">
                You can&apos;t validate this step until you set one video rushs
                drive
              </p>
            )}
          </>
        )}
        {projectStep.status === "done" && isSuccess && (
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
            {projectStep.link ? (
              <FileCell
                title="Drive Provider Name"
                link={projectStep.link}
                lastUpdate={projectStep.updatedAt}
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
          Last update : {lastUpdate}
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
