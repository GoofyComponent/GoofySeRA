import "plyr-react/plyr.css";

import Plyr from "plyr-react";
import { useEffect } from "react";

export const PlyrSection = ({ videoData }: any) => {
  useEffect(() => {
    console.log("◊videoData", videoData);

    console.log(
      "◊!videoData.title || !videoData.sources",
      !videoData.title || !videoData.sources
    );
    console.log(videoData.title);
    console.log(videoData.sources);
  }, [videoData]);

  if (!videoData)
    return (
      <div className="my-6 ml-6">
        <h1>Video not found</h1>
      </div>
    );

  return (
    <div className="my-6 ml-6">
      <Plyr source={videoData} title={videoData.title} />
    </div>
  );
};
