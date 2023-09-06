import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { EditorialForm } from "@/components/app/editorial/EditorialForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Search } from "lucide-react";

export const Editorial = () => {
  const images = [
    { nom: "image1", url: "https://source.unsplash.com/random/800x500" },
    { nom: "image2", url: "https://source.unsplash.com/random/600x400" },
    { nom: "image3", url: "https://source.unsplash.com/random/700x800" },
    { nom: "image4", url: "https://source.unsplash.com/random/500x500" },
    { nom: "image5", url: "https://source.unsplash.com/random/600x400" },
    { nom: "image7", url: "https://source.unsplash.com/random/200x200" },
    { nom: "image1", url: "https://source.unsplash.com/random/800x500" },
    { nom: "image2", url: "https://source.unsplash.com/random/600x400" },
    { nom: "image3", url: "https://source.unsplash.com/random/700x800" },
    { nom: "image4", url: "https://source.unsplash.com/random/500x500" },
    { nom: "image5", url: "https://source.unsplash.com/random/600x400" },
    { nom: "image7", url: "https://source.unsplash.com/random/200x200" },
  ];

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  return (
    <>
      <HeaderTitle title="Editorial" previousTitle="Projet" />
      <div className="flex w-full flex-row">
        <div className=" ml-6 mr-3 flex w-1/2 flex-col justify-end">
          <EditorialForm />
        </div>
        <div className="ml-3 mr-6 flex w-1/2 flex-col justify-end">
          <div className="h-full w-full rounded border "></div>
        </div>
      </div>

      <div className="flex w-full flex-row">
        <div className="ml-6 mr-3 flex w-1/2 flex-col justify-end space-y-2">
          <div className="py-2">
            <Label className="text-lg" htmlFor="image">
              Image
            </Label>
            <div className="flex">
              <Input
                className=" mr-2 cursor-pointer border-sera-jet"
                id="image"
                type="file"
              />
              <Button className="mt-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className="ml-3 mr-6 flex w-1/2 flex-col justify-end space-y-2">
          <div className="mt-2 flex w-full flex-row">
            <div className="ml-6 mr-3 flex w-1/2 flex-col justify-end space-y-2">
              <div className="flex flex-col items-baseline py-2">
                <Label className="mr-2 align-middle text-lg">Knowladge</Label>
                <Dialog>
                  <DialogTrigger>
                    <div>
                      <Button className="mt-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                        Add Knowladge
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Knowladge</DialogTitle>
                      <DialogDescription>
                        <div className="flex">
                          <Input
                            className="mr-1 w-4/5 border border-sera-jet"
                            type="text"
                            placeholder="Search knowladge"
                          />
                          <Button className="w-1/5 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                            <Search size={24} />
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-row">
        <div className=" flex w-full flex-col justify-end ">
          <div className="mx-4">
            <Slider {...settings}>
              {images.map((image: any) => {
                return (
                  <Dialog>
                    <DialogTrigger>
                      <img
                        className="w-100 aspect-square rounded object-cover p-1"
                        src={image.url}
                        alt={image.nom}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{image.nom}</DialogTitle>
                        <DialogDescription>
                          <img className="" src={image.url} alt={image.nom} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};
