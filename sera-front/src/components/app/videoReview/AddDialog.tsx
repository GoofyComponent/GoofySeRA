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
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const AddVideoDialog = ({
  openAddVideo,
  addedVideoName,
  addedVideoDescription,
  addedVideoResolution,
  addVideoFile,
  setOpenAddVideo,
  setAddedVideoName,
  setAddedVideoDescription,
  setAddedVideoResolution,
  setAddVideoFile,
  addVideoMutation,
}: {
  openAddVideo: boolean;
  addedVideoName: string;
  addedVideoDescription: string;
  addedVideoResolution: string;
  addVideoFile: File | null;
  setOpenAddVideo: (value: boolean) => void;
  setAddedVideoName: (value: string) => void;
  setAddedVideoDescription: (value: string) => void;
  setAddedVideoResolution: (value: string) => void;
  setAddVideoFile: (value: File | null) => void;
  addVideoMutation: any;
}) => {
  return (
    <Dialog
      open={openAddVideo}
      onOpenChange={(isOpen) => {
        if (isOpen) return;
        setOpenAddVideo(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a video to review ?</DialogTitle>
          <DialogDescription>
            Add your edited video and the additonnal information to review it
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="video-name">Video name</Label>
          <Input
            type="text"
            placeholder="Video name"
            onChange={(e) => setAddedVideoName(e.target.value)}
            name="video-name"
          />
          <Label htmlFor="video-description">Video description</Label>
          <Input
            type="text"
            placeholder="Video description"
            onChange={(e) => setAddedVideoDescription(e.target.value)}
            name="video-description"
          />
          <Label htmlFor="video-resolution">Video resolution</Label>
          <Input
            type="text"
            placeholder="1080"
            onChange={(e) => setAddedVideoResolution(e.target.value)}
            name="video-resolution"
          />
          <Label htmlFor="video-file">Video file</Label>
          <Input
            type="file"
            placeholder="Video file"
            accept="video/mp4"
            onChange={(e) => {
              if (e.target.files) {
                setAddVideoFile(e.target.files[0]);
              }
            }}
            name="video-file"
            className="hover:cursor-pointer"
          />
          <Button
            onClick={() => {
              addVideoMutation.mutate();
            }}
            className="my-2 w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            disabled={
              !addedVideoName ||
              !addedVideoDescription ||
              !addedVideoResolution ||
              !addVideoFile ||
              addVideoMutation.isLoading
            }
          >
            {!addVideoMutation.isLoading && <p>Add video</p>}
            {addVideoMutation.isLoading && (
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
