import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
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

const FormSchema = z.object({
  lastname: z.string().min(2, {
    message: "Your lastname must be at least 2 characters.",
  }),
  firstname: z.string().min(2, {
    message: "Your firstname must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const UserForm = () => {
  const oldUserData = useSelector((state: any) => state.user.infos);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lastname: oldUserData.lastname,
      firstname: oldUserData.firstname,
      email: oldUserData.email,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Change users infos submitted", data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start space-y-6 rounded-lg bg-sera-periwinkle/20 p-4 drop-shadow-2xl md:w-4/6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Lastname</FormLabel>
              <FormControl>
                <Input {...field} className="border border-sera-jet text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Firstname</FormLabel>
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
