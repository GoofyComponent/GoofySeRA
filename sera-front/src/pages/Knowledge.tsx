import clsx from "clsx";
import { useState } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Knowledge = () => {
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  return (
    <>
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <h2>Knowledge base</h2>

        <div className="flex justify-start">
          <Dialog
            onOpenChange={() => {
              setTicketDialogOpen(!ticketDialogOpen);
            }}
            open={ticketDialogOpen}
          >
            <Button
              onClick={() => setTicketDialogOpen(true)}
              className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            >
              Create a new data
            </Button>
            <DialogContent>
              <p>aaaaaaaaaaaaaaaaaaa</p>
            </DialogContent>
          </Dialog>
          <Input
            type="text"
            placeholder="Search a data"
            className="ml-4 w-60"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50 ">
            <TableHead className="text-xl font-semibold text-sera-jet">
              Name
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet">
              Biography
            </TableHead>
            <TableHead className="text-xl font-semibold text-sera-jet">
              Type
            </TableHead>
            <TableHead className="text-right text-xl font-semibold text-sera-jet">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fakeData.map((data) => (
            <TableRow
              key={data.name}
              className="odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50"
            >
              <TableCell
                className={clsx(
                  " text-base text-black",
                  data.image && "my-4 flex justify-start"
                )}
              >
                {data.image && (
                  <Avatar className="my-auto mr-4">
                    <AvatarImage src={data.image} />
                  </Avatar>
                )}
                <p className="my-auto w-12 truncate md:w-80">{data.name}</p>
              </TableCell>
              <TableCell className="text-base text-black">
                <p className="line-clamp-4 w-12 md:w-80">{data.biography}</p>
              </TableCell>
              <TableCell className="text-base text-black">
                <p className="w-12 truncate md:w-80">{data.type}</p>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-sera-periwinkle text-sera-jet hover:bg-sera-jet hover:text-sera-periwinkle"
                  onClick={() => setTicketDialogOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-sera-periwinkle text-sera-jet hover:bg-sera-jet hover:text-sera-periwinkle"
                  onClick={() => setTicketDialogOpen(true)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
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
