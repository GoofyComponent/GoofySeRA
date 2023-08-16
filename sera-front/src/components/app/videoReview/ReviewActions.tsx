import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReviewActions = ({
  reviewData,
  activeVersion,
  setActiveVersion,
}: any) => {
  return (
    <div className="my-6 ml-6 flex justify-between">
      <Select
        onValueChange={(value) => setActiveVersion(value)}
        value={activeVersion}
        defaultValue={activeVersion}
      >
        <SelectTrigger className="w-2/4">
          <SelectValue placeholder="Version de la vidéo" />
        </SelectTrigger>
        <SelectContent>
          {reviewData.map((element: any) => (
            <SelectItem key={element.version} value={element}>
              {element.version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Link to="/dashboard/tickets" className="my-auto w-1/3">
        <Button className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
          Upload a new version
        </Button>
      </Link>
    </div>
  );
};
