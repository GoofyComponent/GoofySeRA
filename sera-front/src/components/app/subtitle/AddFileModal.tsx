import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axios } from "@/lib/axios";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const AddFileModal = ({
  addFileModal,
  setAddFileModal,
}: {
  addFileModal: boolean;
  setAddFileModal: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { ProjectId } = useParams<{ ProjectId: string }>();

  const [subtiltleFileSubmitted, setSubtiltleFileSubmitted] =
    useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const addSubtitle = useMutation({
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

      formData.append("lang", selectedLanguage);

      const response = await axios.post(
        `/api/projects/${ProjectId}/subtitles`,
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
      queryClient.invalidateQueries(["subtitle", { ProjectId }]);
      setAddFileModal(false);
      setSubtiltleFileSubmitted(null);
    },
  });

  return (
    <Dialog open={addFileModal} onOpenChange={(open) => setAddFileModal(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a transcript file</DialogTitle>
          <DialogDescription>
            Submit a .SRT or .VTT file to add a transcript file. The file will
            be automatically converted to the other format.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="subtitle_lang">Select the language:</Label>
          <Select
            onValueChange={(value) => {
              if (!value) return;
              setSelectedLanguage(value);
            }}
            defaultValue={selectedLanguage}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="subtitle_file">Select your .SRT or .VTT file:</Label>
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
              addSubtitle.mutate();
            }}
          >
            {!addSubtitle.isLoading && <p>Submit</p>}
            {addSubtitle.isLoading && (
              <div className="flex justify-center">
                <BigLoader bgColor="transparent" textColor="sera-periwinkle" />
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
