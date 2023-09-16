import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";
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

export const Addknowledgetable = ({ ProjectId, datas }: any) => {
  if (!datas) return <BigLoader bgColor="transparent" textColor="ser-jet" />;
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
            Type
          </TableHead>
          <TableHead className="text-xl font-semibold text-sera-jet">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {datas.map((data: any, index: number) => (
          <Row
            key={index}
            ProjectId={ProjectId}
            id={data.id}
            name={data.name}
            infos={data.infos}
            imageUrl={data.image}
            type={data.type}
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
  type,
}: {
  ProjectId: string;
  id: string;
  name: string;
  infos: string;
  imageUrl: string;
  type: string;
}) => {
  const queryClient = useQueryClient();
  const [addFormData, setAddFormData] = useState({
    knowledge_id: "",
  });

  const onSubmitAddKnowledge = async (id: string) => {
    setAddFormData({ knowledge_id: id });
    addknowlege.mutate();
  };

  const addknowlege = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("knowledge_id", addFormData.knowledge_id);
      const editorial = await axios.post(
        `http://localhost/api/projects/${ProjectId}/edito/add-knowledge`,
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
      <TableCell className="text-base text-black">
        <p className="truncate">{type}</p>
      </TableCell>
      <TableCell>
        <div className="my-auto flex">
          <PlusCircle
            className="ml-2 hover:cursor-pointer hover:text-sera-jet"
            onClick={() => {
              onSubmitAddKnowledge(id);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
