import { ExternalLink, File, Image } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
/* import { RaptorPlyr } from "@/components/ui/plyrSection"; */
import { formatDate } from "@/lib/utils";

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

  /*   if (type === "video") return <VideoResource />;
   */
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
      <div>
        <p className="font-bold">{name}</p>
        <p>{description}</p>
        <p className="mt-4 italic">{url}</p>
        <p className="font-extralight">{date}</p>
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
        <div>
          <p className="font-bold">{name}</p>
          <p>{description}</p>
          <p className="mt-4 italic">Open the document</p>
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
          <iframe src={url} title={name} className="h-full w-full"></iframe>
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

/* const VideoResource = ({
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
           <RaptorPlyr /> 
        </DialogContent>
      </Dialog>
    </>
  );
}; */
