import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        {searchParams.get("action") === "add" && <AddKnowledgeModal />}
        {searchParams.get("action") === "infos" && <ViewKnowledgeModal />}
        {searchParams.get("action") === "edit" && <EditKnowledgeModal />}
        {searchParams.get("action") === "delete" && <DeleteKnowledgeModal />}
      </Dialog>
    </>
  );
};

const AddKnowledgeModal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [infos, setInfos] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");

  const createKnowledge = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("infos", infos);
      formData.append("type", type);

      if (image) {
        formData.append("image", image);
      }

      const knowledge = await axios.post(`/api/knowledges`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("knowledge created", knowledge.data);
      return knowledge.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["knowledge"]);
      navigate("/dashboard/knowledge");
    },
  });

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
            value={name}
            placeholder={"Name"}
            className="col-span-3"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={infos}
            placeholder={"Infos"}
            className="col-span-3"
            onChange={(e) => setInfos(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <Select onValueChange={(value) => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Location">Location</SelectItem>
              <SelectItem value="Personality">Personality</SelectItem>
              <SelectItem value="Instrument">Instrument</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            className="col-span-3"
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            createKnowledge.mutate();
          }}
          disabled={createKnowledge.isLoading}
        >
          {createKnowledge.isLoading ? "Creating..." : "Create"}
        </Button>
        <Button
          className="my-2 w-full border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
          onClick={() => navigate("/dashboard/knowledge")}
        >
          Close
        </Button>
      </div>
    </DialogContent>
  );
};

const ViewKnowledgeModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: knowledgeData } = useQuery({
    queryKey: ["knowledge-infos", { id: searchParams.get("knowledgeID") }],
    queryFn: async () => {
      const knowledge = await axios.get(
        `/api/knowledges/${searchParams.get("knowledgeID")}`
      );
      console.log(knowledge.data);
      return knowledge.data;
    },
  });

  if (!knowledgeData) return null;

  return (
    <DialogContent className="w-8/12">
      <DialogHeader>
        <DialogTitle>{knowledgeData.name}</DialogTitle>
        <DialogDescription>
          <p>{knowledgeData.type}</p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex">
        {knowledgeData.image && (
          <img
            className="mr-2 w-1/2 rounded-lg"
            src={knowledgeData.image}
            alt={knowledgeData.name}
          />
        )}

        <div className="ml-2 max-h-[40em] w-1/2 overflow-auto">
          <p className="text-xl font-semibold text-sera-jet">Infos</p>
          <p className="text-base text-sera-jet">{knowledgeData.infos}</p>
        </div>
      </div>
      <Button
        className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
        onClick={() => navigate("/dashboard/knowledge")}
      >
        Close
      </Button>
    </DialogContent>
  );
};

const EditKnowledgeModal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [infos, setInfos] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");

  const { data: knowledgeData } = useQuery({
    queryKey: ["knowledge-infos", { id: searchParams.get("knowledgeID") }],
    queryFn: async () => {
      const knowledge = await axios.get(
        `/api/knowledges/${searchParams.get("knowledgeID")}`
      );
      console.log(knowledge.data);
      return knowledge.data;
    },
  });

  const updateKnowledge = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      if (name) formData.append("name", name);
      if (infos) formData.append("infos", infos);
      if (type) formData.append("type", type);

      if (image) {
        formData.append("image", image);
      }

      const knowledge = await axios.post(
        `/api/knowledges/${searchParams.get("knowledgeID")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("knowledge updated", knowledge.data);
      return knowledge.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["knowledge-infos"]);
      queryClient.invalidateQueries(["knowledge"]);
      navigate("/dashboard/knowledge");
    },
  });

  if (!knowledgeData) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update - {knowledgeData.name} ?</DialogTitle>
        <DialogDescription>
          All fields are optional, leave fields blank to make no changes.
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
            value={name}
            placeholder={knowledgeData.name}
            className="col-span-3"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="infos">
            Infos
          </Label>
          <Textarea
            id="infos"
            value={infos}
            placeholder={knowledgeData.infos}
            className="col-span-3"
            onChange={(e) => setInfos(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="type">
            Type
          </Label>
          <Select
            onValueChange={(value) => setType(value)}
            defaultValue={knowledgeData.type}
          >
            <SelectTrigger className="">
              <SelectValue placeholder={knowledgeData.type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Location">Location</SelectItem>
              <SelectItem value="Personality">Personality</SelectItem>
              <SelectItem value="Instrument">Instrument</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2" htmlFor="image">
            Image (optional)
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            className="col-span-3"
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            updateKnowledge.mutate();
          }}
          disabled={updateKnowledge.isLoading}
        >
          {updateKnowledge.isLoading ? "Updating..." : "Update"}
        </Button>
        <Button
          className="my-2 w-full border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
          onClick={() => navigate("/dashboard/knowledge")}
        >
          Close
        </Button>
      </div>
    </DialogContent>
  );
};

const DeleteKnowledgeModal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const { data: knowledgeData } = useQuery({
    queryKey: ["knowledge-infos", { id: searchParams.get("knowledgeID") }],
    queryFn: async () => {
      const knowledge = await axios.get(
        `/api/knowledges/${searchParams.get("knowledgeID")}`
      );
      console.log(knowledge.data);
      return knowledge.data;
    },
  });

  const deleteKnowledge = useMutation({
    mutationFn: async () => {
      const knowledge = await axios.delete(
        `/api/knowledges/${searchParams.get("knowledgeID")}`
      );
      console.log("knowledge deleted", knowledge.data);
      return knowledge.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["knowledge"]);
      navigate("/dashboard/knowledge");
    },
  });

  if (!knowledgeData) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete - {knowledgeData.name} ?</DialogTitle>
        <DialogDescription>
          You are about to delete the data{" "}
          <span className="italic">{knowledgeData.name}</span>.{"\n"}This action
          is irreversible.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button
          className="mx-2 border-2 border-black bg-white text-black transition-all hover:bg-white hover:text-black hover:opacity-25"
          onClick={() => {
            navigate("/dashboard/knowledge");
          }}
        >
          Cancel
        </Button>
        <Button
          className="mx-2 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            deleteKnowledge.mutate();
          }}
          disabled={deleteKnowledge.isLoading}
        >
          {deleteKnowledge.isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </DialogContent>
  );
};
