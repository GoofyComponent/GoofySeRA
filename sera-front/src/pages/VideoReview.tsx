import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { ChatContainer } from "@/components/app/videoReview/ChatContainer";
import { PlyrSection } from "@/components/app/videoReview/PlyrSection";
import { ReviewActions } from "@/components/app/videoReview/ReviewActions";
import { Button } from "@/components/ui/button";
import mockVideoReview from "@/helpers/fakeData/mockVideoReview.json";

export const VideoReview = () => {
  const [activeVersion, setActiveVersion] = useState(mockVideoReview[0]);
  const plyrRef = useRef(null);

  useEffect(() => {
    console.log(activeVersion);
  }, [activeVersion]);

  return (
    <div className="flex justify-start">
      <section className="w-2/3">
        <div className="m-6 flex items-center">
          <Button variant="title" size="title" className="mr-4" asChild>
            <Link
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              to={-1}
            >
              <ChevronLeft size={50} strokeWidth={3} />
            </Link>
          </Button>
          <span className="ml-4 text-4xl">[NOM DU PROJ]</span>
          <ChevronRight size={48} className="ml-2" />
          <h3 className="text-4xl font-bold">Review vidéo</h3>
        </div>
        <ReviewActions
          reviewData={mockVideoReview}
          activeVersion={activeVersion}
          setActiveVersion={setActiveVersion}
        />

        <PlyrSection videoData={activeVersion.video} plyrRef={plyrRef} />
      </section>
      <section className="my-2 ml-4 min-h-full w-1/3 rounded-l-3xl bg-sera-periwinkle/40 py-3">
        <ChatContainer chatData={activeVersion.comments} plyrRef={plyrRef} />
      </section>
    </div>
  );
};
