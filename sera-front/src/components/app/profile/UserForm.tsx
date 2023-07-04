"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { phoneRegex } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Your name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const UserForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("data");
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start space-y-6 rounded-lg bg-sera-periwinkle/20 p-4 drop-shadow-2xl md:w-4/6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Name</FormLabel>
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
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Phone number</FormLabel>
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
        >
          Save
        </Button>
      </form>
    </Form>
  );
};
