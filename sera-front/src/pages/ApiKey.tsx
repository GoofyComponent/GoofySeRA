import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  AddKeyDialog,
  DeleteKeyDialog,
  RenewKeyDialog,
} from "@/components/app/apiKey/ApiKeyModal";
import { ApiKeyTable } from "@/components/app/apiKey/ApiKeyTable";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { accessManager } from "@/lib/utils";

export const ApiKey = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { keyId } = useParams<{ keyId: string }>();

  const [addApiKeyDialog, setAddApiKeyDialog] = useState(false);

  useEffect(() => {
    if (!accessManager("api", undefined)) {
      return navigate("/dashboard");
    }

    console.log(searchParams.get("action"));

    if (searchParams.get("action") && !addApiKeyDialog) {
      console.log("Inside openModal");
      setAddApiKeyDialog(true);
    }
  }, [location]);

  return (
    <section className="flex h-full flex-col">
      <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
        <h2>API Keys</h2>
        <div className="flex justify-between">
          {accessManager(undefined, "add_api_key") && (
            <Button
              onClick={() => navigate("/dashboard/api?action=add")}
              className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            >
              Create a new key
            </Button>
          )}
        </div>
      </div>

      <ApiKeyTable data={data} />

      <Dialog
        onOpenChange={() => {
          navigate("/dashboard/api");
          setAddApiKeyDialog(false);
        }}
        open={addApiKeyDialog}
      >
        {searchParams.get("action") === "add" && <AddKeyDialog />}
        {searchParams.get("action") === "renew" && keyId && <RenewKeyDialog />}
        {searchParams.get("action") === "delete" && keyId && (
          <DeleteKeyDialog />
        )}
      </Dialog>
    </section>
  );
};

const data = [
  {
    name: "test",
    description: "test",
    expiration: new Date("2023-08-01"),
  },
  {
    name: "API key for the website 1",
    description: "API key for the website 1",
    expiration: new Date("2023-12-01"),
  },
];
