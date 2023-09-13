import { Download, ExternalLink, File, Image, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RaptorPlyr } from "@/components/ui/plyrSection";
import { formatDate, SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";

export const SharedRessources = ({ ressourceData }: { ressourceData: any }) => {
  const { type, updated_at, created_at } = ressourceData;
  const dateToDisplay = formatDate(updated_at || created_at);

  if (type === "Captation url")
    return (
      <LinkResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "document")
    return (
      <DocumentResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "image")
    return (
      <ImageResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "video")
    return (
      <VideoResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "transcription")
    return (
      <DocumentResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );
};

const LinkResource = ({
  name,
  description,
  url,
  date,
}: {
  name: string;
  description: string;
  url: string;
  date: string;
}) => {
  return (
    <a
      className="m-2 flex w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all hover:cursor-pointer hover:opacity-50"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLink size={48} className="m-auto" />
      <div className="w-7/12">
        <p className="truncate font-bold">{name}</p>
        <p className=" line-clamp-3">{description}</p>
        <p className="mt-4 truncate italic">{url}</p>
        <p className="line-clamp-3 font-extralight">{date}</p>
      </div>
    </a>
  );
};

const DocumentResource = ({
  name,
  description,
  url,
  date,
}: {
  name: string;
  description: string;
  url: string;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="m-2 flex w-full rounded-lg border-2 border-sera-jet p-2 text-left text-sera-jet transition-all hover:cursor-pointer hover:opacity-50"
        onClick={() => setIsOpen(true)}
      >
        <File size={48} className="m-auto" />
        <div className="w-7/12">
          <p className="truncate font-bold">{name}</p>
          <p className="line-clamp-3">{description}</p>
          <p className="mt-4 truncate italic">Open the document</p>
          <p className="line-clamp-3 font-extralight">{date}</p>
        </div>
      </button>
      <Dialog
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg">
            <iframe src={url} title={name} className="h-full w-full"></iframe>
          </div>
          <p>If the document dosent show up, check your downloads</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ImageResource = ({
  name,
  description,
  url,
  date,
}: {
  name: string;
  description: string;
  url: string;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="m-2 flex w-full rounded-lg border-2 border-sera-jet p-2 text-left text-sera-jet transition-all hover:cursor-pointer hover:opacity-50"
        onClick={() => setIsOpen(true)}
      >
        <Image size={48} className="m-auto" />
        <div className="w-7/12">
          <p className="truncate font-bold">{name}</p>
          <p className="line-clamp-3">{description}</p>
          <p className="mt-4 truncate italic">Open the image</p>
          <p className="line-clamp-3 font-extralight">{date}</p>
        </div>
      </button>
      <Dialog
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg">
            <img src={url} alt={name} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const VideoResource = ({
  name,
  description,
  url,
  date,
}: {
  name: string;
  description: string;
  url: string;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const download = async () => {
    const response = await fetch(url);
    const blob = await response.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `${name}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <button
        className="m-2 flex w-full rounded-lg border-2 border-sera-jet p-2 text-left text-sera-jet transition-all hover:cursor-pointer hover:opacity-50"
        onClick={() => setIsOpen(true)}
      >
        <Video size={48} className="m-auto" />
        <div className="w-7/12">
          <p className="truncate font-bold">{name}</p>
          <p className="line-clamp-3">{description}</p>
          <p className="mt-4 truncate italic">Open the video</p>
          <p className="line-clamp-3 font-extralight">{date}</p>
        </div>
      </button>
      <Dialog
        onOpenChange={(isOpen) => {
          if (isOpen) return;
          setIsOpen(false);
        }}
        open={isOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div
            className="overflow-hidden rounded-lg"
            style={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              "--plyr-color-main": SERA_JET_HEXA,
              "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
            }}
          >
            <RaptorPlyr
              source={{
                type: "video",
                sources: [
                  {
                    src: url,
                  },
                ],
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={download}
                className="my-auto bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              >
                <Download size={20} className="mr-2" />
                Download Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
