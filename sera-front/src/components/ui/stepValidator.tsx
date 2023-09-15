import { Check, CheckSquare, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BigLoader } from "@/pages/skeletons/BigLoader";

export const StepValidator = ({
  projectStepStatus,
  isprojectStatusLoading,
  isprojectStatusSuccess,
  isCurrentStepValid,
  mutationMethod,
  cannotValidateMessage,
  validateAvertissement,
  buttonMessage,
}: {
  projectStepStatus: string;
  isprojectStatusLoading: boolean;
  isprojectStatusSuccess: boolean;
  isCurrentStepValid: boolean;
  mutationMethod: any;
  cannotValidateMessage?: string;
  validateAvertissement?: string;
  buttonMessage: string;
}) => {
  const location = useLocation();
  const currentURL = location.pathname;

  let messageEdit = "";
  if (currentURL.includes("transcript") || currentURL.includes("editing")) {
    messageEdit = "You can't update the information";
  } else if (currentURL.includes("capture") || currentURL.includes("prepare")) {
    messageEdit = "You can still update the information";
  }

  return (
    <div className="flex w-full flex-col">
      {isprojectStatusLoading && !isprojectStatusSuccess && (
        <Loader2
          size={34}
          className="mx-auto animate-spin bg-transparent text-sera-jet"
        />
      )}
      {projectStepStatus != "done" && isprojectStatusSuccess && (
        <>
          <Button
            className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            disabled={!isCurrentStepValid || mutationMethod.isLoading}
            onClick={() => {
              if (isCurrentStepValid) {
                mutationMethod.mutate();
              }
            }}
          >
            {!mutationMethod.isLoading && (
              <>
                <Check />
                <p className="ml-2">{buttonMessage}</p>
              </>
            )}
            {mutationMethod.isLoading && (
              <div className="flex justify-center">
                <BigLoader bgColor="transparent" textColor="sera-periwinkle" />
              </div>
            )}
          </Button>
          {!isCurrentStepValid && cannotValidateMessage && (
            <p className="my-auto text-gray-600">{cannotValidateMessage}</p>
          )}

          {isCurrentStepValid && validateAvertissement && (
            <p className="my-auto text-gray-600">{validateAvertissement}</p>
          )}
        </>
      )}
      {projectStepStatus === "done" && isprojectStatusSuccess && (
        <div className="my-auto flex justify-center rounded-lg border-2 border-sera-jet text-center text-sera-jet">
          <CheckSquare size={32} className="my-auto mr-4" />
          <div className="flex flex-col justify-center text-center">
            <p className="font-bold">This step has been validated.</p>
            <p className="font-extralight italic">{messageEdit}</p>
          </div>
        </div>
      )}
    </div>
  );
};
