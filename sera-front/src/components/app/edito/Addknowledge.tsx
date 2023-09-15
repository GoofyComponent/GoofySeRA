import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axios } from "@/lib/axios";

import { Addknowledgetable } from "./AddknowldegeTable";

export const Addknowledge = ({ ProjectId }: { ProjectId: string }) => {
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
  return (
    <>
      <div className="flex flex-col">
        <div className="my-2 flex justify-start">
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
        <div className="h-[300px] overflow-y-scroll">
          <Addknowledgetable ProjectId={ProjectId} datas={knowledgeData} />
        </div>
      </div>
    </>
  );
};
