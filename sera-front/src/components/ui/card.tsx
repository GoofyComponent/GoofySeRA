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
  projectUrl = "",
}: CardsProps) => {
  if (projectState === "Done") {
    titleBgColor = "bg-red-500";
  } else if (projectState === "in Progress") {
    titleBgColor = "bg-lime-200";
  } else if (projectState === "Draft") {
    titleBgColor = "bg-amber-300";
  }

  function generateRandomColor() {
    // Génère une valeur aléatoire entre 0 et 255 pour chaque composante (rouge, vert, bleu)
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Retourne la couleur au format RGB
    return `rgb(${r},${g},${b})`;
  }

  function generateGradient() {
    const color1 = generateRandomColor();
    const color2 = generateRandomColor();

    // Crée le style de dégradé linéaire avec les deux couleurs générées
    const gradient = `linear-gradient(to right, ${color1}, ${color2})`;

    return gradient;
  }

  const cardStyle = {
    background: generateGradient(),
  };

  if (skeleton) return <></>;

  return (
    <a href={`project/${projectUrl}`}>
      <div
        style={cardStyle}
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
