import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { axios } from "@/lib/axios";
import { stepLinkExtractor } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

import { StepsIndicatorCell } from "./StepsIndicatorCell";

export const StepsIndicatorContainer = () => {
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

  const { data: projectSteps, isLoading } = useQuery({
    queryKey: ["project-steps", { id }],
    queryFn: async () => {
      const project = await axios.get(`/api/projects/${id}/steps`);
      return project.data;
    },
  });

  if (isLoading)
    return (
      <div className="mx-2 flex w-4/12 justify-start text-sera-jet">
        <Separator orientation="vertical" className="w-0.5 bg-sera-jet/50" />
        <BigLoader bgColor="#FFFFFF" textColor="sera-jet" />
      </div>
    );

  return (
    <div className="mx-2 flex min-h-full w-4/12 justify-start text-sera-jet">
      <Separator orientation="vertical" className="w-0.5 bg-sera-jet/50" />
      <aside className="w-full rounded-sm px-2">
        <h3 className="mb-2 text-2xl font-semibold">Steps - Quick access</h3>
        {projectSteps &&
          projectSteps.map((step: any, index: number) => {
            return (
              <StepsIndicatorCell
                key={index}
                step={index + 1}
                title={step.name}
                description={step.description}
                isAccessible={
                  step.status === "done" || step.status === "ongoing"
                }
                isDone={step.status === "done"}
                stepUrl={stepLinkExtractor(index + 1)}
              />
            );
          })}
      </aside>
    </div>
  );
};
