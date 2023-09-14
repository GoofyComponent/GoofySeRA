import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { PlyrSection } from "@/components/ui/plyrSection";
import { Addknowledge } from "@/components/app/edito/addKnowledge";
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
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BigLoader } from "./skeletons/BigLoader";
import { Textarea } from "@/components/ui/textarea";
import { StepValidator } from "@/components/ui/stepValidator";
import { SERA_PERIWINKLE_HEXA, SERA_JET_HEXA } from "@/lib/utils";

export const Editorial = () => {
  const navigate = useNavigate();
  const [addProjectData, setAddProjectData] = useState<any>({
    displayName: "",
    description: "",
    images: [],
  });
  const [addUpdateEditorialData, setAddUpdateEditorialData] = useState<any>({
    displayName: "",
    description: "",
    images: [],
  });
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const [images, setimages] = useState<any>([]);
  const [imgSlide, setImgSlide] = useState<any>([]);
  const [imgUpdate, setImgUpdate] = useState<any>([]);
  const [imgUpdateSlide, setImgUpdateSlide] = useState<any>([]);
  const plyrRef = useRef(null);

  //slider settings
  const sliderRef = useRef<Slider | null>(null);
  var settings = {
    dots: false,
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

  // get last video validated
  const {
    data: editorialsVideos,
    isLoading: editorialsIsLoading,
    refetch: editorialRefetch,
  } = useQuery({
    queryKey: ["editing", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/videos/validated`
      );
      return project.data.video.json;
    },
  });

  // verify if editorial is valid
  const {
    data: projectStep,
    isLoading: projectStepIsLoading,
    isSuccess: projectStepIsSuccess,
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

  const onSubmitAddEditorialForm = async (addProjectData: {
    displayName: string;
    description: string;
    images: any;
  }) => {
    addEditorial.mutate();
    console.log("on submit", addProjectData);
  };

  const onSubmitUpdateEditorialForm = async (addUpdateEditorialData: {
    displayName: string;
    description: string;
    images: any;
  }) => {
    updateEditorial.mutate();
    console.log(addUpdateEditorialData);
  };

  const {
    data: getEditorial,
    isSuccess: getEditorialIsSuccess,
    refetch: getEditorialRefetch,
  } = useQuery({
    queryKey: ["editorial", { ProjectId }],
    queryFn: async () => {
      const editorial = await axios.get(`/api/projects/${ProjectId}/edito`);
      return editorial.data;
    },
  });

  useEffect(() => {
    if (getEditorialIsSuccess && getEditorial) {
      console.log("getEditorial", getEditorial);
      setAddUpdateEditorialData({
        displayName: getEditorial.title,
        description: getEditorial.description,
        images: getEditorial.images,
      });
    }
  }, [getEditorialIsSuccess, getEditorial]);

  const updateEditorial = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", addUpdateEditorialData.displayName);
      formData.append("description", addUpdateEditorialData.description);
      // formData.append("images", images);
      for (let i = 0; i < imgUpdate.length; i++) {
        formData.append("images[]", imgUpdate[i]);
      }
      console.log(formData);
      const editorial = await axios.post(
        `/api/projects/${ProjectId}/edito/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return editorial;
    },
    onSuccess: () => {
      getEditorialRefetch();
      editorialRefetch();
      console.log("success", getEditorial);
    },
    onError: () => {
      return console.log("error");
    },
  });

  const addEditorial = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", addProjectData.displayName);
      formData.append("description", addProjectData.description);
      // formData.append("images", images);
      for (let i = 0; i < images.length; i++) {
        formData.append("images[]", images[i]);
      }
      console.log("form data create", formData);
      const editorial = await axios.post(
        `/api/projects/${ProjectId}/edito`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return editorial;
    },
    onSuccess: () => {
      getEditorialRefetch();
      editorialRefetch();
      setAddProjectData({
        title: "",
        description: "",
        images: [],
      });
    },
    onError: () => {
      return console.log("error");
    },
  });

  const deleteEditorial = useMutation({
    mutationFn: async () => {
      const editorial = await axios.delete(`/api/projects/${ProjectId}/edito`);
      return editorial;
    },
    onSuccess: () => {
      getEditorialRefetch();
      editorialRefetch();
      setAddProjectData({
        title: "",
        description: "",
        images: [],
      });
    },
    onError: () => {
      return console.log("error");
    },
  });

  useEffect(() => {
    setAddProjectData({
      ...addProjectData,
      images: images,
    });
    console.log("images", images);
  }, [images]);

  useEffect(() => {
    setAddUpdateEditorialData({
      ...addUpdateEditorialData,
      images: imgUpdate,
    });
    console.log("imagesUpdate", imgUpdate);
  }, [imgUpdate]);

  useEffect(() => {
    console.log("imgupdateSlide", imgUpdateSlide);
  }, [imgUpdateSlide]);

  useEffect(() => {
    console.log("formdata", addProjectData);
  }, [addProjectData]);

  return (
    <>
      <HeaderTitle title="Editorial" previousTitle={"Projet"} />
      <div className="mb-4 flex w-full justify-center">
        <div className="w-[95%]">
          <StepValidator
            projectStepStatus={projectStep?.status}
            isprojectStatusLoading={projectStepIsLoading}
            isprojectStatusSuccess={projectStepIsSuccess}
            isCurrentStepValid={false}
            mutationMethod={validateStep}
            cannotValidateMessage="You can't validate this step until you set one video rushs drive"
            buttonMessage="Validate this step"
          />
        </div>
      </div>
      {editorialsIsLoading && (
        <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
      )}
      {getEditorialIsSuccess && Object.values(getEditorial).length === 0 ? (
        <>
          <div className="flex w-full flex-row justify-evenly ">
            <div className="  flex w-[45%] flex-col ">
              <h3 className="text-2xl font-semibold">Add Editorial</h3>
              <div className="flex flex-col justify-start space-y-4 rounded-lg drop-shadow-2xl">
                <div>
                  <Label className="text-lg" htmlFor="displayName">
                    Display Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Display Name"
                    id="displayName"
                    value={addProjectData.displayName}
                    onChange={(e) =>
                      setAddProjectData({
                        ...addProjectData,
                        displayName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-lg" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Description"
                    id="description"
                    value={addProjectData.description}
                    onChange={(e) =>
                      setAddProjectData({
                        ...addProjectData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className=" flex w-full flex-col justify-end  space-y-6">
                <div className="py-2">
                  <Label className="text-lg" htmlFor="image">
                    Image
                  </Label>
                  <div className="flex">
                    <Input
                      name="image[]"
                      className=" mr-2 cursor-pointer border-sera-jet"
                      id="image"
                      type="file"
                      onChange={(e) => {
                        console.log("images", images);
                        const files = e.target.files?.[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImgSlide([...imgSlide, files]);
                          setimages([...images, files]);
                        };
                        files && reader.readAsDataURL(files);
                        (e.target as HTMLInputElement).value = "";

                        console.log("images", images);
                      }}
                    />
                  </div>
                  <div className={"relative mx-2 mt-2"}>
                    {imgSlide.length > 0 ? (
                      <>
                        {imgSlide.length > 3 && (
                          <div
                            className="previous absolute right-full top-1/2 cursor-pointer"
                            onClick={goToPrevious}
                          >
                            <ChevronLeft className="duration-100 ease-in hover:scale-[1.2] " />
                          </div>
                        )}
                        <Slider ref={sliderRef} {...settings}>
                          {imgSlide.map((file: any) => {
                            const img = new Blob([file], {
                              type: "image/png",
                            });
                            const url = URL.createObjectURL(img);
                            return (
                              <Dialog key={file.name}>
                                <DialogTrigger className="w-full">
                                  <div className="relative">
                                    <img
                                      className="aspect-square w-full rounded object-cover p-1"
                                      src={url}
                                      alt={file.name}
                                    />

                                    <div
                                      className="absolute right-0 top-0 cursor-pointer"
                                      onClick={() => {
                                        setImgSlide(
                                          imgSlide.filter(
                                            (item: any) =>
                                              item.name !== file.name
                                          )
                                        );
                                      }}
                                    >
                                      <X className="duration-100 ease-in hover:scale-[1.2] " />
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{file.name}</DialogTitle>
                                    <DialogDescription>
                                      <img
                                        className=""
                                        src={url}
                                        alt={file.name}
                                      />
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            );
                          })}
                        </Slider>
                        {imgSlide.length > 3 && (
                          <div
                            className="next absolute left-full top-1/2 cursor-pointer"
                            onClick={goToNext}
                          >
                            <ChevronRight className="duration-100 ease-in hover:scale-[1.2] " />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="flex h-[140px] items-center justify-center text-center">
                          No images selected
                        </p>
                      </>
                    )}
                  </div>
                  <div className=" flex w-full flex-col space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                      onClick={() => onSubmitAddEditorialForm(addProjectData)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex w-[45%] flex-col ">
              {!editorialsIsLoading && (
                <>
                  <div
                    className="mb-2 overflow-hidden rounded-lg"
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      "--plyr-color-main": SERA_JET_HEXA,
                      "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
                    }}
                  >
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
        getEditorial && (
          <div className="flex w-full flex-row justify-evenly ">
            <div className="  flex w-[45%] flex-col ">
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold">Update Editorial</h3>{" "}
                <Button onClick={() => deleteEditorial.mutate()}>delete</Button>
              </div>
              <div className="flex flex-col justify-start space-y-4 rounded-lg drop-shadow-2xl">
                <div>
                  <Label className="text-lg" htmlFor="displayName">
                    Display Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Display Name"
                    id="displayName"
                    value={addUpdateEditorialData.displayName}
                    onChange={(e) =>
                      setAddUpdateEditorialData({
                        ...addUpdateEditorialData,
                        displayName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-lg" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Description"
                    id="description"
                    value={addUpdateEditorialData.description}
                    onChange={(e) =>
                      setAddUpdateEditorialData({
                        ...addUpdateEditorialData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className=" flex w-full flex-col justify-end  space-y-6">
                <div className="py-2">
                  <Label className="text-lg" htmlFor="image">
                    Image
                  </Label>
                  <div className="flex">
                    <Input
                      name="image[]"
                      className=" mr-2 cursor-pointer border-sera-jet"
                      id="image"
                      type="file"
                      onChange={(e) => {
                        // add url
                        setImgUpdateSlide;
                        const files = e.target.files?.[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImgUpdateSlide([...imgUpdateSlide, files]);
                        };
                        files && reader.readAsDataURL(files);
                        (e.target as HTMLInputElement).value = "";

                        setImgUpdate(e.target.files);
                      }}
                    />
                  </div>
                  <div className={"relative mx-2 mt-2"}>
                    {imgUpdateSlide && imgUpdateSlide.length > 0 ? (
                      <>
                        {imgUpdateSlide && imgUpdateSlide.length > 3 && (
                          <div
                            className="previous absolute right-full top-1/2 cursor-pointer"
                            onClick={goToPrevious}
                          >
                            <ChevronLeft className="duration-100 ease-in hover:scale-[1.2] " />
                          </div>
                        )}
                        <Slider ref={sliderRef} {...settings}>
                          {imgUpdateSlide &&
                            imgUpdateSlide.map((file: any) => {
                              const img = new Blob([file], {
                                type: "image/png",
                              });
                              const url = URL.createObjectURL(img);
                              return (
                                <Dialog key={file.name}>
                                  <DialogTrigger className="w-full">
                                    <div className="relative">
                                      <img
                                        className="aspect-square w-full rounded object-cover p-1"
                                        src={url}
                                        alt={file.name}
                                      />

                                      <div
                                        className="absolute right-0 top-0 cursor-pointer"
                                        onClick={() => {
                                          setImgUpdateSlide(
                                            imgUpdateSlide.filter(
                                              (item: any) =>
                                                item.name !== file.name
                                            )
                                          );
                                        }}
                                      >
                                        <X className="duration-100 ease-in hover:scale-[1.2] " />
                                      </div>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{file.name}</DialogTitle>
                                      <DialogDescription>
                                        <img
                                          className=""
                                          src={url}
                                          alt={file.name}
                                        />
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              );
                            })}
                        </Slider>
                        {imgUpdateSlide && imgUpdateSlide.length > 3 && (
                          <div
                            className="next absolute left-full top-1/2 cursor-pointer"
                            onClick={goToNext}
                          >
                            <ChevronRight className="duration-100 ease-in hover:scale-[1.2] " />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="flex h-[140px] items-center justify-center text-center">
                          No images selected
                        </p>
                      </>
                    )}
                  </div>
                  <div className=" flex w-full flex-col space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                      onClick={() =>
                        onSubmitUpdateEditorialForm(addUpdateEditorialData)
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex w-[45%] flex-col ">
              {!editorialsIsLoading && (
                <>
                  <div
                    className="mb-2 overflow-hidden rounded-lg"
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      "--plyr-color-main": SERA_JET_HEXA,
                      "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
                    }}
                  >
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
                            <Addknowledge />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};
