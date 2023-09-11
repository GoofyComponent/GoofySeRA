import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { KnowledgeTable } from "@/components/app/knowledge/KnowledgeTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Knowledge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dataId } = useParams<{ dataId: string }>();

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  useEffect(() => {
    console.log(dataId);
    if (searchParams.get("action") === "add") {
      console.log("add");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "infos") {
      console.log("infos");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "edit") {
      console.log("edit");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "delete") {
      console.log("delete");
      setTicketDialogOpen(true);
    }
  }, [dataId]);

  return (
    <>
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <div className="flex">
          <h2>Knowledge base</h2>
          <Button
            onClick={() => {
              navigate("/dashboard/knowledge?action=add");
              setTicketDialogOpen(true);
            }}
            className="ml-4 mt-1 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          >
            Create a new data
          </Button>
        </div>

        <div className="flex justify-start">
          <Input
            className="mr-2 w-[360px]"
            type="text"
            placeholder="Search in the database"
            value={"searchInput"}
            onChange={(e) => {
              console.log(e.target.value);
              /* const inputValue = e.target.value;
              setSearchInput(inputValue);
              if (inputValue.trim() === "") {
                refetchUsers(users);
              } */
            }}
          />
          <Button
            onClick={() => console.log("") /* refetchUsers(users) */}
            className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          >
            Search
          </Button>
        </div>
      </div>
      <KnowledgeTable datas={fakeData} />

      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            navigate("/dashboard/knowledge");
          }
          setTicketDialogOpen(!ticketDialogOpen);
        }}
        open={ticketDialogOpen}
      >
        {searchParams.get("action") === "add" && AddKnowledgeModal()}
        {searchParams.get("action") === "infos" && ViewKnowledgeModal()}
        {searchParams.get("action") === "edit" && EditKnowledgeModal()}
        {searchParams.get("action") === "delete" && DeleteKnowledgeModal()}
      </Dialog>
    </>
  );
};

const AddKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new info ?</DialogTitle>
        <DialogDescription>
          <p>
            You are about to create a new info. Please fill in the following
            fields.
          </p>
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="name">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={""}
            placeholder={"Name"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={""}
            placeholder={"Infos"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <p>Select</p>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => console.log("")}
        >
          Create
        </Button>
      </div>
    </DialogContent>
  );
};

const ViewKnowledgeModal = () => {
  return (
    <DialogContent className="w-1/2">
      <DialogHeader>
        <DialogTitle>Data Name</DialogTitle>
        <DialogDescription>
          <p>Type</p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex">
        <img
          className="mr-2 w-1/2 rounded-lg"
          src="https://source.unsplash.com/random"
        />
        <div className="ml-2 max-h-[40em] w-1/2 overflow-auto">
          <p className="text-xl font-semibold text-sera-jet">Infos</p>
          <p className="text-base text-sera-jet">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            {/*  ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, ronec maximus, mauris ut
            aliquam ultrices, rLorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec maximus, mauris ut aliquam ultrices, rLorem
            ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus,
            mauris ut aliquam ultrices, ronec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, r */}
          </p>
        </div>
      </div>
      <Button
        className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
        onClick={() => console.log("")}
      >
        Close
      </Button>
    </DialogContent>
  );
};

const EditKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update - [infosname] ?</DialogTitle>
      </DialogHeader>
      <div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="name">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={""}
            placeholder={"Name"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={""}
            placeholder={"Infos"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <p>Select</p>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            console.log("");
          }}
        >
          Create
        </Button>
      </div>
    </DialogContent>
  );
};

const DeleteKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete - [Dataname] ?</DialogTitle>
        <DialogDescription>
          <p>You are about to delete the data [Dataname].</p>
          <p>This action is irreversible.</p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button
          className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
          onClick={() => {}}
        >
          Cancel
        </Button>
        <Button
          className="mx-2 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            console.log("");
          }}
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  );
};

const fakeData = [
  {
    name: "Louvre",
    biography:
      "Musée d'art situé à Paris, en France. Il est l'un des musées les plus visités au monde et abrite une collection d'art sans précédent, notamment la Joconde et la Vénus de Milo.",
    type: "lieu",
    image: "https://source.unsplash.com/random",
  },
  {
    name: "Grande Muraille de Chine",
    biography:
      "Mur de fortifications construit en Chine au cours des siècles. C'est l'une des plus grandes structures artificielles du monde et est considéré comme un chef-d'œuvre de l'ingénierie.",
    type: "monument",
  },
  {
    name: "Albert Einstein",
    biography:
      "Physicien théoricien d'origine allemande. Il est considéré comme l'un des plus grands scientifiques de tous les temps et a reçu le prix Nobel de physique en 1921 pour ses contributions à la théorie de la relativité.",
    type: "personne",
  },
  {
    name: "Marie Curie",
    biography:
      "Chimiste et physicienne d'origine polonaise. Elle est la première femme à avoir reçu le prix Nobel et la seule à l'avoir reçu à deux reprises. Elle a étudié la radioactivité et a découvert les éléments polonium et radium.",
    type: "personne",
    image: "https://source.unsplash.com/random",
  },
  {
    name: "Leonardo da Vinci",
    biography:
      "Peintre, sculpteur, architecte, inventeur et scientifique italien de la Renaissance. Il est considéré comme l'un des plus grands génies de tous les temps et a laissé une œuvre inestimable dans de nombreux domaines.",
    type: "personne",
  },
  {
    name: "Mona Lisa",
    biography:
      "Portrait peint par Leonardo da Vinci. Il est considéré comme l'un des plus célèbres tableaux du monde et est exposé au musée du Louvre à Paris.",
    type: "oeuvre d'art",
  },
  {
    name: "Vénus de Milo",
    biography:
      "Statue grecque antique représentant Aphrodite, la déesse de l'amour et de la beauté. Elle est exposée au musée du Louvre à Paris.",
    type: "oeuvre d'art",
  },
  {
    name: "La Symphonie n° 9 de Beethoven",
    biography:
      "Symphonie composée par Ludwig van Beethoven. Elle est considérée comme l'une des plus grandes symphonies de tous les temps et est souvent appelée la Symphonie du Destin.",
    type: "oeuvre musicale",
  },
  {
    name: "La Traviata",
    biography:
      "Opéra composé par Giuseppe Verdi. Il est basé sur le roman La Dame aux camélias d'Alexandre Dumas fils.",
    type: "oeuvre musicale",
  },
  {
    name: "Le Sacre du printemps",
    biography:
      "Ballet composé par Igor Stravinsky. Il est considéré comme l'un des plus importants ballets du XXe siècle et est connu pour sa musique révolutionnaire.",
    type: "oeuvre musicale",
  },
  {
    name: "Le Seigneur des anneaux",
    biography:
      "Trilogie de romans fantastiques écrits par J. R. R. Tolkien. Elle est considérée comme l'une des plus grandes œuvres de la littérature fantastique et a été adaptée au cinéma.",
    type: "oeuvre littéraire",
  },
  {
    name: "Harry Potter",
    biography:
      "Suite de romans fantastiques écrits par J. K. Rowling. Elle est considérée comme l'une des plus grandes œuvres de la littérature jeunesse et a été adaptée au cinéma.",
    type: "oeuvre littéraire",
  },
  {
    name: "La Guerre des étoiles",
    biography:
      "Suite de films de science-fiction écrits et réalisés par George Lucas. Elle est considérée comme l'une des plus grandes sagas cinématographiques de tous les temps et a été adaptée en de nombreux produits dérivés.",
    type: "oeuvre cinématographique",
  },
];
