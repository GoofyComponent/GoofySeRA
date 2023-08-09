import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const UserInfosSummarySkeletons = () => {
  return (
    <div>
      <div className="flex justify-start text-base">
        <Skeleton className="h-6 w-full animate-pulse" />
      </div>

      <Separator className="my-2" />
      <Skeleton className="mb-2 h-6 w-full animate-pulse" />
      <Skeleton className="h-6 w-full animate-pulse" />
    </div>
  );
};
