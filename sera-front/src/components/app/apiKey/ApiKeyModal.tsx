import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AddKeyDialog = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [keyName, setKeyName] = useState("");
  const [keyDescription, setKeyDescription] = useState("");
  const [keyExpiration, setKeyExpiration] = useState<Date>();

  if (apiKey && apiKey != "") {
    return <></>;
  }

  return (
    <DialogContent>
      <DialogHeader>
        <h2 className="text-xl font-semibold text-sera-jet">
          Create a new API key
        </h2>
      </DialogHeader>
      <DialogDescription className="text-sm text-sera-jet">
        Generate a new API key to use with the Sera API.
      </DialogDescription>
      <div>
        <div className="flex flex-col">
          <Label htmlFor="keyExpiration" className="mb-2">
            Key expiration
          </Label>
          <DatePicker
            date={keyExpiration}
            setDate={setKeyExpiration}
            hideToday={true}
          />
        </div>
        <div>
          <Label htmlFor="keyName" className="mb-2">
            Key name
          </Label>
          <Input
            id="keyName"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="keyDescription" className="mb-2">
            Key description
          </Label>
          <Input
            id="keyDescription"
            value={keyDescription}
            onChange={(e) => setKeyDescription(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter className="w-full">
        <Button
          type="submit"
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            console.log(keyName, keyDescription, keyExpiration);
          }}
        >
          Create API Key
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
