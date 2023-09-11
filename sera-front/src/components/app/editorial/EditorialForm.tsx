import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";
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

export const EditorialForm = (
  displayName: any,
  setAddProjectData: any,
  addProjectData: any
) => {
  return (
    <>
      <div className="flex flex-col justify-start space-y-6 rounded-lg drop-shadow-2xl">
        <Input
          type="text"
          placeholder="Display Name"
          id="displayName"
          value={displayName}
          onChange={(e) =>
            setAddProjectData({
              ...addProjectData,
              displayName: e.target.value,
            })
          }
        />
      </div>
    </>
  );
};
