import { Label } from "@radix-ui/react-label";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { KnowledgeTable } from "@/components/app/knowledge/KnowledgeTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";

export const Knowledge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dataId } = useParams<{ dataId: string }>();

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  const { data: knowledgeData } = useQuery({
    queryKey: ["knowledge"],
    queryFn: async () => {
      const knowledge = await axios.get(`/api/knowledges`);
      console.log(knowledge.data);
      return knowledge.data;
    },
  });

  console.log(knowledgeData);

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
            value={"searchInput"}
            onChange={(e) => {
              console.log(e.target.value);
              /* const inputValue = e.target.value;
              setSearchInput(inputValue);
              if (inputValue.trim() === "") {
                refetchUsers(users);
              } */
            }}
          />
          <Button
            onClick={() => console.log("") /* refetchUsers(users) */}
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
        {searchParams.get("action") === "add" && AddKnowledgeModal()}
        {searchParams.get("action") === "infos" && ViewKnowledgeModal()}
        {searchParams.get("action") === "edit" && EditKnowledgeModal()}
        {searchParams.get("action") === "delete" && DeleteKnowledgeModal()}
      </Dialog>
    </>
  );
};

const AddKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new info ?</DialogTitle>
        <DialogDescription>
          <p>
            You are about to create a new info. Please fill in the following
            fields.
          </p>
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="name">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={""}
            placeholder={"Name"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={""}
            placeholder={"Infos"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <p>Select</p>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => console.log("")}
        >
          Create
        </Button>
      </div>
    </DialogContent>
  );
};

const ViewKnowledgeModal = () => {
  return (
    <DialogContent className="w-1/2">
      <DialogHeader>
        <DialogTitle>Data Name</DialogTitle>
        <DialogDescription>
          <p>Type</p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex">
        <img
          className="mr-2 w-1/2 rounded-lg"
          src="https://source.unsplash.com/random"
          alt=""
        />
        <div className="ml-2 max-h-[40em] w-1/2 overflow-auto">
          <p className="text-xl font-semibold text-sera-jet">Infos</p>
          <p className="text-base text-sera-jet">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit amet,
            consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            {/*  ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, ronec maximus, mauris ut
            aliquam ultrices, rLorem ipsum dolor sit amet, consectetur
            adipiscing elit. Donec maximus, mauris ut aliquam ultrices, rLorem
            ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus,
            mauris ut aliquam ultrices, ronec maximus, mauris ut aliquam
            ultrices, rLorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec maximus, mauris ut aliquam ultrices, rLorem ipsum dolor sit
            amet, consectetur adipiscing elit. Donec maximus, mauris ut aliquam
            ultrices, r */}
          </p>
        </div>
      </div>
      <Button
        className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
        onClick={() => console.log("")}
      >
        Close
      </Button>
    </DialogContent>
  );
};

const EditKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update - [infosname] ?</DialogTitle>
      </DialogHeader>
      <div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="name">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={""}
            placeholder={"Name"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={""}
            placeholder={"Infos"}
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <p>Select</p>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            className="col-span-3"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            console.log("");
          }}
        >
          Create
        </Button>
      </div>
    </DialogContent>
  );
};

const DeleteKnowledgeModal = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete - [Dataname] ?</DialogTitle>
        <DialogDescription>
          <p>You are about to delete the data [Dataname].</p>
          <p>This action is irreversible.</p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button
          className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
          onClick={() => {}}
        >
          Cancel
        </Button>
        <Button
          className="mx-2 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            console.log("");
          }}
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  );
};
