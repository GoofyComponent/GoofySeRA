import { useState } from "react";

import { Button } from "@/components/ui/button";
import { accessManager } from "@/lib/utils";

import { AddFileModal } from "./AddFileModal";

export const NoSubtitleCell = () => {
  const [addFileModal, setAddFileModal] = useState(false);

  return (
    <>
      <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
        <div className="flex justify-between pb-2">
          <p className="my-2 text-xl font-bold ">No file added</p>
          {accessManager(undefined, "add_subs") && (
            <Button
              className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              onClick={() => setAddFileModal(true)}
            >
              Upload a new SRT file
            </Button>
          )}
        </div>

        <p className="my-1 truncate text-lg ">
          You can add a file by clicking on the upload button
        </p>
      </article>
      <AddFileModal
        addFileModal={addFileModal}
        setAddFileModal={setAddFileModal}
      />
    </>
  );
};
