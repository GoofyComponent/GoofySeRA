import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axios } from "@/lib/axios";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const EditoKnowledgeTable = ({ ProjectId, getEditorial }: any) => {
  if (!getEditorial)
    return <BigLoader bgColor="transparent" textColor="ser-jet" />;
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/50">
          <TableHead className="text-xl font-semibold text-sera-jet">
            Name
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            Informations
          </TableHead>

          <TableHead className="text-xl font-semibold text-sera-jet">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {getEditorial.map((data: any, index: number) => (
          <Row
            key={index}
            ProjectId={ProjectId}
            id={data.id}
            name={data.name}
            infos={data.infos}
            imageUrl={data.image}
          />
        ))}
      </TableBody>
    </Table>
  );
};

const Row = ({
  ProjectId,
  id,
  name,
  infos,
  imageUrl,
}: {
  ProjectId: string;
  id: string;
  name: string;
  infos: string;
  imageUrl: string;
}) => {
  const queryClient = useQueryClient();
  const [addFormData, setAddFormData] = useState({
    knowledge_id: "",
  });

  const onSubmitDeleteKnowledge = async (id: string) => {
    setAddFormData({ knowledge_id: id });
    deleteKnowlege.mutate();
  };

  const deleteKnowlege = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("knowledge_id", addFormData.knowledge_id);
      const editorial = await axios.post(
        `/api/projects/${ProjectId}/edito/remove-knowledge`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return editorial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["editorial"]);
    },
  });

  return (
    <TableRow className=" odd:bg-sera-periwinkle/25 even:bg-sera-periwinkle/50 hover:odd:bg-sera-periwinkle/25 hover:even:bg-sera-periwinkle/50">
      <TableCell
        className={clsx(
          "text-base text-black",
          imageUrl && "flex justify-start"
        )}
      >
        <p className="my-auto truncate">{name}</p>
      </TableCell>
      <TableCell className="text-base text-black">
        <p className="line-clamp-2">{infos}</p>
      </TableCell>
      <TableCell>
        <div className="my-auto flex">
          <X
            className="ml-2 hover:cursor-pointer hover:text-sera-jet"
            onClick={() => {
              onSubmitDeleteKnowledge(id);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
