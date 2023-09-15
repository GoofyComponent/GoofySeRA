import { useQuery } from "@tanstack/react-query";
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
import { axios } from "@/lib/axios";
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

    if (searchParams.get("action") && !addApiKeyDialog) {
      setAddApiKeyDialog(true);
    }
  }, [location]);

  const { data: apiKeyData, refetch: apiKeyRefetch } = useQuery({
    queryKey: ["api-key"],
    queryFn: async () => {
      const keys = await axios.get(`/api/api-keys`);
      return keys.data;
    },
  });

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

      <ApiKeyTable data={apiKeyData} />

      <Dialog
        onOpenChange={() => {
          navigate("/dashboard/api");
          apiKeyRefetch();
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
