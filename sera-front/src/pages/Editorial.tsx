import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";

import { Addknowledge } from "@/components/app/edito/Addknowledge";
import { EditoKnowledgeTable } from "@/components/app/edito/EditoKnowledgeTable";
import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RaptorPlyr } from "@/components/ui/plyrSection";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";
import {
  accessManager,
  SERA_JET_HEXA,
  SERA_PERIWINKLE_HEXA,
} from "@/lib/utils";

import { BigLoader } from "./skeletons/BigLoader";

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
  const [openDialog, setOpenDialog] = useState(false);
  const lastSeenProjectName = useSelector(
    (state: any) => state.app.lastSeenProjectName
  );

  //slider settings
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
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

  const projectStep = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Editorial`
      );

      if (project.data[0].status === "not_started") {
        toast({
          title: "This step is no available for the moment !",
          description: `The capture step is not accessible a the moment. Please try again later.`,
        });
        return navigate(`/dashboard/projects/${ProjectId}`);
      }

      return project.data[0];
    },
  });

  // get last video validated
  const {
    data: editorialsVideos,
    isLoading: editorialsIsLoading,
    isSuccess: editorialsIsSuccess,
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

  const onSubmitAddEditorialForm = async () => {
    addEditorial.mutate();
  };

  const onSubmitUpdateEditorialForm = async () => {
    updateEditorial.mutate();
  };
  // get editorial
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
  });

  useEffect(() => {
    setAddProjectData({
      ...addProjectData,
      images: images,
    });
  }, [images]);

  useEffect(() => {
    setAddUpdateEditorialData({
      ...addUpdateEditorialData,
      images: imgUpdate,
    });
  }, [imgUpdate]);

  if (projectStep.isLoading)
    return (
      <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
    );

  return (
    <>
      <HeaderTitle
        title="Editorial"
        previousTitle={lastSeenProjectName}
        linkPath={`/dashboard/projects/${ProjectId}`}
      />
      {editorialsIsLoading && (
        <BigLoader loaderSize={42} bgColor="transparent" textColor="sera-jet" />
      )}
      {getEditorialIsSuccess && Object.values(getEditorial).length === 0 ? (
        <>
          <div className="flex w-full flex-row justify-evenly ">
            <div className="  flex w-[45%] flex-col ">
              <h3 className="text-2xl font-semibold text-sera-jet">
                Add Editorial
              </h3>
              <div className="flex flex-col justify-start space-y-4 rounded-lg drop-shadow-2xl">
                <div>
                  <Label
                    className="text-lg text-sera-jet"
                    htmlFor="displayName"
                  >
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
                  <Label
                    className="text-lg text-sera-jet"
                    htmlFor="description"
                  >
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
                  <Label className="text-lg text-sera-jet" htmlFor="image">
                    Image
                  </Label>
                  <div className="flex">
                    <Input
                      name="image[]"
                      className=" mr-2 cursor-pointer border-sera-jet"
                      id="image"
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files?.[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImgSlide([...imgSlide, files]);
                          setimages([...images, files]);
                        };
                        files && reader.readAsDataURL(files);
                        (e.target as HTMLInputElement).value = "";
                      }}
                    />
                  </div>
                  <div className={"relative mx-2 mt-2"}>
                    {imgSlide.length > 0 ? (
                      <>
                        {imgSlide.length > 3 && (
                          <button
                            title="button"
                            className="previous absolute right-full top-1/2 cursor-pointer"
                            onClick={goToPrevious}
                          >
                            <ChevronLeft className="duration-100 ease-in hover:scale-[1.2] " />
                          </button>
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

                                    <button
                                      title="button"
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
                                    </button>
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
                          <button
                            title="button"
                            className="next absolute left-full top-1/2 cursor-pointer"
                            onClick={goToNext}
                          >
                            <ChevronRight className="duration-100 ease-in hover:scale-[1.2] " />
                          </button>
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
                  {accessManager(undefined, "save_edito") && (
                    <div className=" flex w-full flex-col space-y-2">
                      <Button
                        type="submit"
                        className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                        onClick={() => onSubmitAddEditorialForm()}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=" flex w-[45%] flex-col ">
              {!editorialsIsLoading && getEditorialIsSuccess && ProjectId && (
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
                    <RaptorPlyr source={editorialsVideos} ref={plyrRef} />
                  </div>
                  <div className=" flex w-full flex-col space-y-2">
                    <Label className="mr-2 align-middle text-lg">
                      Knowledge
                    </Label>
                    {accessManager(undefined, "add_knowledge_to_edito") && (
                      <Button
                        className="mt-0 w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                        disabled={
                          getEditorial &&
                          Object.values(getEditorial).length === 0
                        }
                        onClick={() => setOpenDialog(true)}
                      >
                        Add Knowlage
                      </Button>
                    )}
                    <Dialog
                      open={openDialog}
                      onOpenChange={(open) => setOpenDialog(open)}
                    >
                      <DialogContent className="!max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Add Knowlage</DialogTitle>
                          <DialogDescription>
                            <Addknowledge ProjectId={ProjectId} />
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
                <h3 className="text-2xl font-semibold text-sera-jet">
                  Update Editorial
                </h3>
              </div>
              <div className="flex flex-col justify-start space-y-4 rounded-lg drop-shadow-2xl">
                <div>
                  <Label
                    className="text-lg text-sera-jet"
                    htmlFor="displayName"
                  >
                    Display Name
                  </Label>
                  <Input
                    type="text"
                    placeholder={getEditorial.title}
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
                  <Label
                    className="text-lg text-sera-jet"
                    htmlFor="description"
                  >
                    Description
                  </Label>
                  <Textarea
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={getEditorial.description}
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
                  <Label className="text-lg text-sera-jet" htmlFor="image">
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
                          <button
                            title="button"
                            className="previous absolute right-full top-1/2 cursor-pointer"
                            onClick={goToPrevious}
                          >
                            <ChevronLeft className="duration-100 ease-in hover:scale-[1.2] " />
                          </button>
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

                                      <button
                                        title="button"
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
                                      </button>
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
                          <button
                            title="button"
                            className="next absolute left-full top-1/2 cursor-pointer"
                            onClick={goToNext}
                          >
                            <ChevronRight className="duration-100 ease-in hover:scale-[1.2] " />
                          </button>
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
                  {accessManager(undefined, "save_edito") && (
                    <div className=" flex w-full flex-col space-y-2">
                      <Button
                        type="submit"
                        className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                        onClick={() => onSubmitUpdateEditorialForm()}
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=" flex w-[45%] flex-col ">
              {editorialsIsSuccess && ProjectId && (
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
                    <RaptorPlyr source={editorialsVideos} ref={plyrRef} />
                  </div>
                  <div className=" flex w-full flex-col space-y-2">
                    <Label className="mr-2 align-middle text-lg">
                      Knowledge
                    </Label>
                    {accessManager(undefined, "add_knowledge_to_edito") && (
                      <Button
                        className="mt-0 w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                        disabled={
                          getEditorial &&
                          Object.values(getEditorial).length === 0
                        }
                        onClick={() => setOpenDialog(true)}
                      >
                        Add Knowlage
                      </Button>
                    )}
                    <Dialog
                      open={openDialog}
                      onOpenChange={(open) => setOpenDialog(open)}
                    >
                      <DialogContent className="!max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Add Knowledge</DialogTitle>
                          <DialogDescription>
                            <Addknowledge ProjectId={ProjectId} />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <div>
                      {getEditorialIsSuccess &&
                      getEditorial.knowledges.length > 0 ? (
                        <EditoKnowledgeTable
                          ProjectId={ProjectId}
                          getEditorial={getEditorial.knowledges}
                          getEditorialIsSuccess={getEditorialIsSuccess}
                        />
                      ) : (
                        <p className="text-center text-lg font-semibold">
                          No Knowledge
                        </p>
                      )}
                    </div>
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
