import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeHelp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { SharedRessources } from "./sharedRessources";

export const SharedContainer = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [ressourceType, setRessourceType] = useState("");
  const [ressourceName, setRessourceName] = useState("");
  const [ressourceDescription, setRessourceDescription] = useState("");
  const [ressourceFile, setRessourceFile] = useState<File | null>(null);

  const { data: ressourceData, isLoading: ressourceIsLoading } = useQuery({
    queryKey: ["ressources", { ProjectId }],
    queryFn: async () => {
      const ressources = await axios.get(
        `/api/projects/${ProjectId}/ressources`
      );
      return ressources.data;
    },
  });

  const createRessource = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", ressourceName);
      formData.append("description", ressourceDescription);
      formData.append("type", ressourceType);
      if (ressourceFile) formData.append("file", ressourceFile);

      const res = await axios.post(
        `/api/projects/${ProjectId}/ressources`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ressources", { ProjectId }]);
      setDialogOpen(false);
    },
  });

  if (ressourceIsLoading)
    return (
      <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
    );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-4xl font-medium text-sera-jet">
          Shared ressources :
        </h3>
        <Button
          className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => setDialogOpen(true)}
        >
          Add ressource
        </Button>
      </div>
      <div className="mx-2 grid grid-cols-2 gap-3">
        {ressourceData.map((ressource: any, index: number) => (
          <SharedRessources key={index} ressourceData={ressource} />
        ))}
      </div>

      <Dialog
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setDialogOpen(false);
        }}
        open={dialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <BadgeHelp size={44} />
                <span className="ml-2"> Add ressource </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex flex-col">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                className="col-span-3"
                onChange={(e) => setRessourceName(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Label htmlFor="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                className="col-span-3"
                onChange={(e) => setRessourceDescription(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) => setRessourceType(value as string)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    Image (JPEG, JPG, PNG, WEBP, GIF)
                  </SelectItem>
                  <SelectItem value="document">
                    Document (PDF, DOCX, XLSX, PPTX, TXT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4">
              <Label htmlFor="file">File</Label>
              <Input
                type="file"
                id="file"
                accept={
                  ressourceType === "image"
                    ? "image/jpeg, image/jpg, image/png, image/webp, image/gif"
                    : ressourceType === "document"
                    ? ".pdf, .docx, .xlsx, .pptx, .txt"
                    : ""
                }
                className="col-span-3"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.files) return;
                  const file = e.target.files[0];
                  if (!file) return;
                  setRessourceFile(file);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger>
              <Button className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25">
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              type="submit"
              className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              onClick={() => createRessource.mutate()}
              disabled={createRessource.isLoading}
            >
              {createRessource.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add ressource"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
