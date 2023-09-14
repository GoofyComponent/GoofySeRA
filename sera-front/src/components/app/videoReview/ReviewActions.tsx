import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accessManager } from "@/lib/utils";

export const ReviewActions = ({
  editingData,
  setActiveVersion,
  setOpenAddVideo,
}: any) => {
  const [searchParams] = useSearchParams();
  const def = searchParams.get("version") || "0";

  return (
    <div className="my-6 ml-6 flex justify-between">
      <Select
        onValueChange={(value) => {
          setActiveVersion(value);
        }}
        defaultValue={editingData.length > 0 ? def : "-1"}
        disabled={editingData.length === 0}
      >
        <SelectTrigger className="w-2/4">
          <SelectValue placeholder="Version de la vidéo" />
        </SelectTrigger>
        <SelectContent>
          {editingData.map((element: any, index: number) => (
            <SelectItem key={index} value={index.toString()}>
              Version {element.version}
            </SelectItem>
          ))}
          {editingData.length === 0 && (
            <SelectItem value="-1">Upload a version first !</SelectItem>
          )}
        </SelectContent>
      </Select>

      {accessManager(undefined, "add_video_version") && (
        <div className="my-auto w-1/3">
          <Button
            className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            onClick={() => setOpenAddVideo(true)}
          >
            Upload a new version
          </Button>
        </div>
      )}
    </div>
  );
};
