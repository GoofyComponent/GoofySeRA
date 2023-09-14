import { useMutation } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { axios } from "@/lib/axios";

export const AddKeyDialog = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyIndicator, setCopyIndicator] = useState<boolean>(false);

  const [keyName, setKeyName] = useState<string | null>(null);
  const [keyDescription, setKeyDescription] = useState<string | null>(null);
  const [keyExpire, setKeyExpire] = useState(true);
  const [keyExpiration, setKeyExpiration] = useState<Date | null>(null);

  const createKey = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      if (keyName) formData.append("name", keyName);

      if (keyDescription) {
        formData.append("description", keyDescription);
      } else {
        formData.append("description", "");
      }

      if (keyExpire && keyExpiration) {
        formData.append(
          "expires_at",
          keyExpiration.toISOString().split("T")[0]
        );
        formData.append("never_expires", "0");
      } else {
        formData.append("never_expires", "1");
      }

      const key = await axios.post(`/api/api-keys`, formData);

      return key.data;
    },
    onSuccess: (response) => {
      console.log(response);
      if (response) {
        setApiKey(response.data.key);
      }
    },
  });

  if (apiKey && apiKey != "") {
    return (
      <Displaykey
        apiKey={apiKey}
        setCopyIndicator={setCopyIndicator}
        copyIndicator={copyIndicator}
        from="create"
      />
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-sera-jet">
          Create a new API key
        </DialogTitle>
        <DialogDescription className="text-sm text-sera-jet">
          Generate a new API key to use with the Sera API.
        </DialogDescription>
      </DialogHeader>

      <div>
        <div className="my-4">
          <Label htmlFor="keyExpire" className="my-auto">
            Make the key expire after a certain date?
          </Label>
          <Switch
            className="ml-4 mr-auto"
            checked={keyExpire}
            onCheckedChange={(value) => setKeyExpire(value)}
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="keyExpiration" className="mb-2">
            Key expiration
          </Label>
          <DatePicker
            date={keyExpiration}
            setDate={setKeyExpiration}
            hideToday={true}
            disabled={!keyExpire}
          />
        </div>

        <div>
          <Label htmlFor="keyName" className="mb-2">
            Key name
          </Label>
          <Input
            id="keyName"
            value={keyName || ""}
            onChange={(e) => setKeyName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="keyDescription" className="mb-2">
            Key description (optional)
          </Label>
          <Input
            id="keyDescription"
            value={keyDescription || ""}
            onChange={(e) => setKeyDescription(e.target.value)}
          />
        </div>
      </div>

      <p className="h-[2em] text-sm font-semibold text-red-600">
        {error ? error : ""}
      </p>

      <DialogFooter className="w-full">
        <Button
          type="submit"
          className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => {
            setError(null);
            if (keyName == null || keyName == "") {
              setError("The key name is required");
              return;
            }
            if (keyExpire && keyExpiration == null) {
              setError("The key expiration date is required");
              return;
            }
            if (keyExpire && keyExpiration != null) {
              if (keyExpiration < new Date()) {
                setError("The key expiration date must be in the future");
                return;
              }
            }

            createKey.mutate();
          }}
          disabled={createKey.isLoading}
        >
          {createKey.isLoading ? "Loading..." : "Create API Key"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export const RenewKeyDialog = () => {
  const { keyId } = useParams<{ keyId: string }>();

  const [apiKey, setApiKey] = useState<string>("");
  const [copyIndicator, setCopyIndicator] = useState<boolean>(false);

  const renewKey = useMutation({
    mutationFn: async () => {
      const key = await axios.post(`/api/api-keys/${keyId}/recreate`);

      return key.data;
    },
    onSuccess: (response) => {
      console.log(response);
      if (response) {
        setApiKey(response.data.key);
      }
    },
  });

  if (apiKey && apiKey != "") {
    return (
      <Displaykey
        apiKey={apiKey}
        setCopyIndicator={setCopyIndicator}
        copyIndicator={copyIndicator}
        from="renew"
      />
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-sera-jet">
          Regenerate this API key ?
        </DialogTitle>
        <DialogDescription className="text-sm text-sera-jet">
          All the services using this API key will be unable to use the Sera API
          anymore.
          <br />
          You&apos;ll need to add the api key to use it again
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="w-full">
        <Button
          type="submit"
          className="w-full bg-red-600 text-white hover:bg-red-600 hover:opacity-60"
          onClick={() => {
            renewKey.mutate();
          }}
          disabled={renewKey.isLoading}
        >
          {renewKey.isLoading ? "Loading..." : "I understand, renew API Key"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export const DeleteKeyDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-sera-jet">
          Delete this API key ?
        </DialogTitle>
        <DialogDescription className="text-sm text-sera-jet">
          All the services using this API key will be unable to use the Sera API
          anymore.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="w-full">
        <Button
          type="submit"
          className="w-full bg-red-600 text-white hover:bg-red-600 hover:opacity-60"
          onClick={() => {
            console.log("delete");
          }}
        >
          I understand, delete API Key
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const Displaykey = ({
  apiKey,
  setCopyIndicator,
  copyIndicator,
  from,
}: {
  apiKey: string;
  setCopyIndicator: any;
  copyIndicator: boolean;
  from: string;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-sera-jet">
          {from === "create" && "Create a new API key"}
          {from === "renew" && "Regenerate API key"}
        </DialogTitle>
        <DialogDescription className="text-sm text-sera-jet">
          {from === "create" &&
            "Generate a new API key to use with the Sera API."}
          {from === "renew" &&
            "All the services using this API key will be unable to use the Sera API anymore."}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Label className="text-lg text-sera-jet">There is your API key</Label>
        <p className="text-md text-sera-jet/75">
          Copy it, and save it. You won&apos;t be able to see it again.
        </p>
      </div>
      <div className="flex justify-between">
        <Input className="w-11/12" value={apiKey} readOnly />
        <button
          type="button"
          title="Copy API key to clipboard"
          className="ml-2 w-1/12 rounded-lg border border-sera-jet transition-opacity hover:cursor-pointer hover:opacity-50"
          onClick={() => {
            navigator.clipboard.writeText(apiKey);
            setCopyIndicator(true);
            setTimeout(() => {
              setCopyIndicator(false);
            }, 1000);
          }}
        >
          {copyIndicator ? (
            <Check className="mx-auto my-2" size={24} />
          ) : (
            <Copy className="mx-auto my-2" size={24} />
          )}
        </button>
      </div>
    </DialogContent>
  );
};
