import "plyr-react/plyr.css";

import { Loader2 } from "lucide-react";
import Plyr from "plyr-react";
import { useSelector } from "react-redux";

export const PlyrSection = ({ videoData, plyrRef }: any) => {
  const markers = useSelector((state: any) => state.videoReview.playerMarkers);
  const isPlayerReady = useSelector(
    (state: any) => state.videoReview.isPlayerReady
  );

  if (!videoData)
    return (
      <div className="m-auto">
        <h1>Video not found</h1>
      </div>
    );

  return (
    <div className="my-6 ml-6 overflow-hidden rounded-lg">
      {isPlayerReady ? (
        <Plyr
          ref={plyrRef}
          source={videoData}
          options={{ markers }}
          title={videoData.title}
        />
      ) : (
        <Loader2
          ref={plyrRef}
          size={64}
          className={`m-auto animate-spin text-sera-jet`}
        />
      )}
    </div>
  );
};
