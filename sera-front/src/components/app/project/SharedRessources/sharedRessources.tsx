import { ExternalLink, Image } from "lucide-react";

import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const SharedRessources = ({ ressourceData }: { ressourceData: any }) => {
  const { type, updated_at, created_at } = ressourceData;
  const dateToDisplay = formatDate(updated_at || created_at);

  console.log(type);

  if (type === "Captation url")
    return (
      <LinkResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "document") return <DocumentResource />;

  if (type === "image")
    return (
      <ImageResource
        name={ressourceData.name}
        description={ressourceData.description}
        url={ressourceData.url}
        date={dateToDisplay}
      />
    );

  if (type === "video") return <VideoResource />;

  if (type === "transcription") return <TextResource />;
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
  console.log(url);
  return (
    <a
      className="m-2 flex w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all hover:cursor-pointer hover:opacity-50"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLink size={48} className="m-auto" />
      <div>
        <p className="font-bold">{name}</p>
        <p>{description}</p>
        <p className="mt-4 italic">{url}</p>
        <p className="font-extralight">{date}</p>
      </div>
    </a>
  );
};

const DocumentResource = () => {
  return <div></div>;
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
        <div>
          <p className="font-bold">{name}</p>
          <p>{description}</p>
          <p className="mt-4 italic">Open the image</p>
          <p className="font-extralight">{date}</p>
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
          <img src={url} alt={name} />
        </DialogContent>
      </Dialog>
    </>
  );
};

const VideoResource = () => {
  return <div></div>;
};

const TextResource = () => {
  return <div></div>;
};
