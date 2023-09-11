import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const FileUpdateModal = ({
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
