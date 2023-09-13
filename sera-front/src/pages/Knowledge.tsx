import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  AddKnowledgeModal,
  DeleteKnowledgeModal,
  EditKnowledgeModal,
  ViewKnowledgeModal,
} from "@/components/app/knowledge/KnowledgeModal";
import { KnowledgeTable } from "@/components/app/knowledge/KnowledgeTable";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axios } from "@/lib/axios";

export const Knowledge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dataId } = useParams<{ dataId: string }>();

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { data: knowledgeData, refetch: refetchKnowledge } = useQuery({
    queryKey: ["knowledge"],
    queryFn: async () => {
      let call = "/api/knowledges";
      if (searchInput.trim() !== "") {
        call = `/api/knowledges?search=${searchInput}`;
      }
      const knowledge = await axios.get(call);
      return knowledge.data;
    },
  });

  useEffect(() => {
    console.log(dataId);
    if (searchParams.get("action") === "add") {
      console.log("add");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "infos") {
      console.log("infos");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "edit") {
      console.log("edit");
      setTicketDialogOpen(true);
    }
    if (searchParams.get("action") === "delete") {
      console.log("delete");
      setTicketDialogOpen(true);
    }
  }, [dataId]);

  return (
    <>
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <div className="flex">
          <h2>Knowledge base</h2>
          <Button
            onClick={() => {
              navigate("/dashboard/knowledge?action=add");
              setTicketDialogOpen(true);
            }}
            className="ml-4 mt-1 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          >
            Create a new data
          </Button>
        </div>

        <div className="flex justify-start">
          <Input
            className="mr-2 w-[360px]"
            type="text"
            placeholder="Search in the database"
            value={searchInput}
            onChange={(e) => {
              const inputValue = e.target.value;
              setSearchInput(inputValue);
              if (inputValue.trim() === "") {
                refetchKnowledge();
              }
            }}
          />
          <Button
            onClick={() => refetchKnowledge()}
            className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          >
            Search
          </Button>
        </div>
      </div>
      <KnowledgeTable datas={knowledgeData} />

      <Dialog
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            navigate("/dashboard/knowledge");
          }
          setTicketDialogOpen(!ticketDialogOpen);
        }}
        open={ticketDialogOpen}
      >
        {searchParams.get("action") === "add" && <AddKnowledgeModal />}
        {searchParams.get("action") === "infos" && <ViewKnowledgeModal />}
        {searchParams.get("action") === "edit" && <EditKnowledgeModal />}
        {searchParams.get("action") === "delete" && <DeleteKnowledgeModal />}
      </Dialog>
    </>
  );
};
