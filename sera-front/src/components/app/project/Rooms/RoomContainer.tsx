import { Clapperboard, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

export const RoomContainer = () => {
  return (
    <>
      <h3 className="text-4xl font-medium">Room :</h3>
      <RoomCard />
      <div className="m-2 flex h-20 w-96 justify-start rounded-lg border-2 border-dashed border-sera-jet px-4 py-2">
        <Plus className="m-auto" />
        <p className="m-auto text-xl">SELECT A ROOM</p>
      </div>
    </>
  );
};

const RoomCard = () => {
  return (
    <div className="m-2 flex h-20 w-96 justify-start rounded-lg border-2 border-sera-jet px-1">
      <Clapperboard className="my-auto mr-2" size={48} />
      <div>
        <h4 className="text-xl">Name</h4>
        <p className="text-normal">Description</p>
        <p className="text-normal">Address</p>
      </div>
      <Button
        className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
        aria-label={`Remove ${"the room"} from the project`}
        onClick={() => console.log("delete")}
      >
        <Trash size={28} strokeWidth={2.25} />
      </Button>
    </div>
  );
};
