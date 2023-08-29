import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";

const FormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, {
        message: "Your password is required.",
      })
      .min(2, {
        message: "Your password must be at least 2 characters.",
      }),
    newPassword: z
      .string()
      .min(1, {
        message: "Your password is required.",
      })
      .min(5, {
        message: "Your password must be at least 5 characters.",
      }),
    confirmNewPassword: z
      .string()
      .min(1, {
        message: "Your password is required.",
      })
      .min(2, {
        message: "Your password must be at least 2 characters.",
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords don't match",
  });

export const PasswordForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (data.newPassword !== data.confirmNewPassword) {
      return;
    }

    if (
      !data.currentPassword ||
      !data.newPassword ||
      !data.confirmNewPassword
    ) {
      return;
    }

    updateUserPassword.mutate(data);
  };

  const updateUserPassword = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const formData = new FormData();

      formData.append("current_password", data.currentPassword);
      formData.append("new_password", data.newPassword);
      formData.append("new_confirm_password", data.confirmNewPassword);

      return await axios.post("/api/users/password", formData);
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: `Your password has been updated.`,
      });

      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start space-y-6 rounded-lg bg-sera-periwinkle/20 p-4 drop-shadow-2xl md:w-4/6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Current password</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">New password</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Confirm password</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="ml-auto flex border-2 bg-sera-jet text-base text-sera-periwinkle hover:border-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet md:w-1/12"
          /*           disabled={updateUserPassword.isLoading || !form.formState.isValid}
           */
        >
          {updateUserPassword.isLoading ? (
            <Loader2 className={`m-auto animate-spin`} size={12} />
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  );
};
