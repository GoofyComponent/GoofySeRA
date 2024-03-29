import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerLogin } from "@/helpers/slices/AppSlice";
import { axios } from "@/lib/axios";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [typedError, setTypedError] = useState<string>("");

  const loginRequest = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      return await axios.post("/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error: any) => {
      setTypedError(error.response?.data.message);
    },
    onSuccess: () => {
      setTypedError("");
      dispatch(registerLogin());
      navigate(`/dashboard`);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    loginRequest.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-4 flex w-full flex-col justify-center space-y-6 xl:px-12"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  className={"border-sera-periwinkle outline-sera-periwinkle"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className={"border-sera-periwinkle outline-sera-periwinkle"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loginRequest.isError && (
          <FormMessage className="text-red-500">{typedError}</FormMessage>
        )}

        <Button
          type="submit"
          className="mx-auto w-1/2 border-2 bg-sera-periwinkle text-xl font-semibold text-sera-jet hover:border-sera-periwinkle hover:bg-sera-jet hover:text-sera-periwinkle"
          disabled={loginRequest.isLoading}
        >
          {loginRequest.isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
};
