import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";

export const ImageForm = () => {
  const oldUserData = useSelector((state: any) => state.user.infos);
  const form = useForm();

  const onClick = async () => {
    const inputElement = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;
    if (
      !inputElement ||
      !inputElement.files ||
      inputElement.files.length === 0
    ) {
      toast({
        title: "No image",
        description: "Please select an image to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", inputElement.files[0]);

    try {
      const response = await axios.post(
        `/api/users/${oldUserData.id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data) {
        toast({
          title: "Success!",
          description: `Your image has been updated successfully.`,
        });
        const imageUpdated = new Event("imageUpdated");
        document.dispatchEvent(imageUpdated);
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      toast({
        title: "Failed to update image",
        description: `Please try again later.`,
      });
    }
  };

  return (
    <div className="flex flex-col justify-start space-y-6 rounded-lg bg-sera-periwinkle/20 p-4 drop-shadow-2xl md:w-4/6">
      <form className="flex flex-col space-y-4">
        <Label htmlFor="imageInput" className="text-lg">
          Image
        </Label>
        <Input
          type="file"
          accept="image/*"
          id="imageInput"
          name="imageInput"
          className="border-sera-jet text-sera-jet"
        />
        <Button
          type="button"
          className="ml-auto flex border-2 bg-sera-jet text-base text-sera-periwinkle hover:border-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet md:w-1/12"
          onClick={onClick}
          disabled={!form.formState.isValid}
        >
          Save
        </Button>
      </form>
    </div>
  );
};
