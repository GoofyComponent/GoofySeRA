interface CardsProps {
  skeleton: boolean;
  projectUrl: string;
  title: string;
  projectState: any;
  shortDesc: string;
  bgImage: string;
}

let titleBgColor = "";

const Card = ({
  skeleton,
  title,
  projectState,
  shortDesc,
  bgImage,
  projectUrl = "",
}: CardsProps) => {
  if (projectState === "Done") {
    titleBgColor = "bg-red-500";
  } else if (projectState === "in Progress") {
    titleBgColor = "bg-lime-200";
  } else if (projectState === "Draft") {
    titleBgColor = "bg-amber-300";
  }

  if (skeleton) return <></>;

  return (
    <a href={`project/${projectUrl}`}>
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className=" h-[150px]  overflow-hidden text-ellipsis rounded-lg border-2 bg-cover bg-center p-3 text-white duration-300 ease-in-out hover:scale-105 "
      >
        <div className="flex items-center justify-between text-xl">
          <span>{title}</span>
          <span className={`${titleBgColor} rounded-lg px-6 py-1 text-black`}>
            {projectState}
          </span>
        </div>
        <p className="pt-8">{shortDesc}</p>
      </div>
    </a>
  );
};

export { Card };
