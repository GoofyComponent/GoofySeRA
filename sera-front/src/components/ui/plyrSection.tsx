import "plyr-react/plyr.css";

import { Loader2 } from "lucide-react";
import Plyr, { APITypes, PlyrProps, usePlyr } from "plyr-react";
import React from "react";
import { useSelector } from "react-redux";

import { SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

/* const defaultOptions = {
  ratio: "16:9",
  captions: { active: true, update: true, language: "auto" },
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "captions",
    "settings",
    "fullscreen",
  ],
}; */

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
    <div
      className="my-6 ml-6 overflow-hidden rounded-lg"
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        "--plyr-color-main": SERA_JET_HEXA,
        "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
      }}
    >
      {isPlayerReady ? (
        <Plyr
          ref={plyrRef}
          source={videoData}
          options={{ markers }}
          title={videoData.title}
          crossOrigin="anonymous"
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

    if (!source)
      return <BigLoader bgColor="transparent" textColor="sera-jet" />;

    const raptorRef = usePlyr(ref, {
      source,
      options,
    }) as React.MutableRefObject<HTMLVideoElement>;

    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        ref={raptorRef}
        crossOrigin="anonymous"
        className="plyr-react plyr rounded-lg"
      />
    );
  }
);
RaptorPlyr.displayName;
