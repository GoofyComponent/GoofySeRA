import "plyr-react/plyr.css";

import { Loader2 } from "lucide-react";
import Plyr, { APITypes, PlyrProps, usePlyr } from "plyr-react";
import React from "react";
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

export const RaptorPlyr = React.forwardRef<APITypes, PlyrProps>(
  (props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, {
      source,
      options,
    }) as React.MutableRefObject<HTMLVideoElement>;

    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video ref={raptorRef} className="plyr-react plyr" />;
  }
);
RaptorPlyr.displayName;
