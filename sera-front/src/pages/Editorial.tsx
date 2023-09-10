import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { EditorialForm } from "@/components/app/editorial/EditorialForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PlyrSection } from "@/components/ui/plyrSection";
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
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BigLoader } from "./skeletons/BigLoader";

export const Editorial = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const plyrRef = useRef(null);

  const [activeVersion, setActiveVersion] = useState<string>(
    searchParams.get("version") || "0"
  );

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

  const sliderRef = useRef<Slider | null>(null);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };
  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const {
    data: editorialsVideos,
    isLoading: editorialsIsLoading,
    isSuccess: editingIsSuccess,
    refetch: editingRefetch,
  } = useQuery({
    queryKey: ["editing", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/videos/validated`
      );
      setActiveVersion(searchParams.get("version") || "0");
      return project.data.video.json;
    },
  });

  const {
    data: projectStep,
    isLoading,
    isSuccess,
    refetch: refetchProjectStep,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Editorial`
      );
      return project.data[0];
    },
  });

  const validateStep = useMutation({
    mutationFn: async () => {
      const project = await axios.post(
        `/api/projects/${ProjectId}/captation-to-postproduction`
      );

      return project;
    },
    onSuccess: () => {
      refetchProjectStep();
      navigate(`/dashboard/projects/${ProjectId}/editing`);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  return (
    <>
      <HeaderTitle title="Editorial" previousTitle="Projet" />

      {!editorialsIsLoading ? (
        <>
          {projectStep != "done" && (
            <div className="mb-4 flex justify-evenly">
              <Button
                className="w-[90%] bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                // disabled={!isEditorialValid}
                // onClick={() => {
                //   if (isEditorialValid) {
                //     validateStep.mutate();
                //   }
                // }}
              >
                <Check />
                <p className="ml-2">Validate this step</p>
              </Button>
            </div>
          )}

          <div className="flex w-full flex-row justify-evenly ">
            <div className="  flex w-[45%] flex-col ">
              <EditorialForm />
              <div className=" flex w-full flex-col justify-end  space-y-2">
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
                  <div className="relative mx-2 mt-2">
                    <div
                      className="previous absolute right-full top-1/2 cursor-pointer"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="duration-100 ease-in hover:scale-[1.2] " />
                    </div>
                    <Slider ref={sliderRef} {...settings}>
                      {images.map((image: any) => {
                        return (
                          <Dialog key={image.nom}>
                            <DialogTrigger className="w-full">
                              <img
                                className="aspect-square w-full rounded object-cover p-1"
                                src={image.url}
                                alt={image.nom}
                              />
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{image.nom}</DialogTitle>
                                <DialogDescription>
                                  <img
                                    className=""
                                    src={image.url}
                                    alt={image.nom}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                    </Slider>
                    <div
                      className="next absolute left-full top-1/2 cursor-pointer"
                      onClick={goToNext}
                    >
                      <ChevronRight className="duration-100 ease-in hover:scale-[1.2] " />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex w-[45%] flex-col ">
              {!editorialsIsLoading && (
                <>
                  <div className="mb-2 overflow-hidden rounded-lg">
                    <PlyrSection
                      videoData={editorialsVideos}
                      plyrRef={plyrRef}
                    />
                  </div>
                  <div className=" flex w-full flex-col space-y-2">
                    <Label className="mr-2 align-middle text-lg">
                      Knowladge
                    </Label>
                    <Dialog>
                      <DialogTrigger>
                        <div>
                          <Button className="mt-0 w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                            Add Knowlage
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Knowlage</DialogTitle>
                          <DialogDescription>
                            <div className="flex">
                              <Input
                                className="mr-1 w-4/5 border border-sera-jet"
                                type="text"
                                placeholder="Search knowlage"
                              />
                              <Button className="mt-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                                <Search size={24} />
                              </Button>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
      )}
    </>
  );
};
