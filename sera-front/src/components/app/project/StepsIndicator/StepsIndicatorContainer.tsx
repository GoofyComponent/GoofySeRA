import { Separator } from "@/components/ui/separator";

import { StepsIndicatorCell } from "./StepsIndicatorCell";

export const StepsIndicatorContainer = () => {
  return (
    <div className="mx-2 flex w-4/12 justify-start text-sera-jet">
      <Separator orientation="vertical" className="w-0.5 bg-sera-jet/50" />
      <aside className="w-full rounded-sm px-2">
        <h3 className="mb-2 text-2xl font-semibold">Steps - Quick access</h3>
        <StepsIndicatorCell
          step={1}
          title="Planification"
          description="Planification de la mission"
          isAccessible={true}
          stepUrl="/project/1/planification"
        />
        <StepsIndicatorCell
          step={2}
          title="Captation"
          description="Préparation de la mission"
          isAccessible={false}
          stepUrl="/project/1/captation"
        />
        <StepsIndicatorCell
          step={3}
          title="Review vidéo"
          description="Analyse des données"
          isAccessible={false}
          stepUrl="/project/1/review-video"
        />
        <StepsIndicatorCell
          step={4}
          title="Transcription & sous-titrage"
          description="Analyse des données"
          isAccessible={false}
          stepUrl="/project/1/transcription-subtitles"
        />
        <StepsIndicatorCell
          step={5}
          title="Edito"
          description="Analyse des données"
          isAccessible={false}
          stepUrl="/project/1/edito"
        />
      </aside>
    </div>
  );
};
