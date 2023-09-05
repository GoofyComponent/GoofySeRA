import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { updateInfos } from "@/helpers/slices/UserSlice";
import { axios } from "@/lib/axios";

const FormSchema = z.object({
  lastname: z
    .string()
    .min(5, {
      message: "Your lastname must be at least 5 characters.",
    })
    .optional(),
  firstname: z
    .string()
    .min(5, {
      message: "Your firstname must be at least 5 characters.",
    })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export const EditorialForm = () => {
  const oldUserData = useSelector((state: any) => state.user.infos);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lastname: undefined,
      firstname: undefined,
      email: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (
      data.lastname === oldUserData.lastname &&
      data.firstname === oldUserData.firstname &&
      data.email === oldUserData.email
    ) {
      toast({
        title: "No change",
        description: `You entered the same infos as before. Please change at least one field.`,
      });
      return;
    }

    if (!data.lastname && !data.firstname && !data.email) {
      toast({
        title: "Wrong inputs",
        description: `Please change at least one field.`,
      });
      return;
    }

    return updateUserData.mutate(data);
  };

  const updateUserData = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const formData = new URLSearchParams();

      if (data.lastname) formData.append("lastname", data.lastname);
      if (data.firstname) formData.append("firstname", data.firstname);
      if (data.email) formData.append("email", data.email);

      if (formData.toString() === "") throw new Error("No data to update");

      return await axios.put(`/api/users/${oldUserData.id}`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    onSuccess: (response: any) => {
      if (response && response.data) {
        dispatch(updateInfos(response.data));

        toast({
          title: "Success !",
          description: `Your infos have been correctly updated.`,
        });
      }

      return;
    },
    onError: (error: any) => {
      console.log("error", error);

      toast({
        title: "Were unable to update your infos at the moment",
        description: `Please try again later.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start space-y-6 rounded-lg drop-shadow-2xl "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Display Name</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none border border-sera-jet bg-transparent text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="ml-auto flex border-2 bg-sera-jet text-base text-sera-periwinkle hover:border-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet md:w-1/12"
          disabled={updateUserData.isLoading || !form.formState.isValid}
        >
          {updateUserData.isLoading ? (
            <Loader2 className={`m-auto animate-spin`} size={12} />
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  );
};
