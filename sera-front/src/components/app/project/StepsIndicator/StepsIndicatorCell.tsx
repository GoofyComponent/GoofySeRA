import clsx from "clsx";
import { CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface StepsIndicatorCellProps {
  step: number;
  title: string;
  description: string;
  isAccessible: boolean;
  isDone: boolean;
  stepUrl: string;
}

export const StepsIndicatorCell = ({
  step,
  title,
  description,
  isAccessible,
  isDone,
  stepUrl,
}: StepsIndicatorCellProps) => {
  return (
    <Link
      to={isAccessible ? stepUrl : "#"}
      className={clsx(
        "my-2 flex justify-start rounded-xl border-2 border-sera-jet p-2 transition-all ",
        !isAccessible && "opacity-50",
        isAccessible &&
          "hover:cursor-pointer hover:bg-sera-jet hover:text-sera-periwinkle"
      )}
      style={{ pointerEvents: isAccessible ? "auto" : "none" }}
    >
      <h4 className="my-auto w-1/6 text-xl font-extrabold">{`${step}.`}</h4>
      <div className="w-5/6">
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-normal italic">
          {description && isAccessible && description}
          {!isAccessible && "You cannot access to this step for the moment."}
        </p>
      </div>
      {isDone && (
        <CheckCheck size={32} className="my-auto" strokeWidth={2.75} />
      )}
    </Link>
  );
};
