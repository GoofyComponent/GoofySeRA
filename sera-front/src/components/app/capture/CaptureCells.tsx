import { convertDateFromDateType } from "@/lib/utils";

export const FileCell = ({
  title,
  link,
  lastUpdate,
}: {
  title: string;
  link: string;
  lastUpdate: string;
}) => {
  return (
    <article className="mb-0 mt-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all hover:cursor-pointer hover:border-sera-jet/50 hover:text-sera-jet/50">
      <a href={link} target="_blank" rel="noreferrer">
        <p className="my-2 text-xl font-bold ">{title}</p>
        <p className="my-1 truncate text-lg ">{link}</p>
        <p className="my-2 text-right font-extralight italic">
          Last update : {convertDateFromDateType(new Date(lastUpdate))}
        </p>
      </a>
    </article>
  );
};

export const NoFileCell = () => {
  return (
    <article className="mb-0 mt-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
      <p className="my-2 text-xl font-bold ">No file added</p>
      <p className="my-1 truncate text-lg ">
        You can add a file by clicking on the update button
      </p>
    </article>
  );
};
