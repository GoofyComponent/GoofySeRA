import { createSlice } from "@reduxjs/toolkit";

import { videoTimeDeserializer } from "@/lib/utils";

interface intialStateTypes {
  isPlayerReady: boolean;
  id: string | null;
  versionName: string | null;
  video: string | null;
  comments: any[] | null;
  playerMarkers: {
    enabled: boolean;
    points: { time: number; label: string }[];
  };
}

const initialState: intialStateTypes = {
  isPlayerReady: false,
  id: null,
  versionName: null,
  video: null,
  comments: null,
  playerMarkers: { enabled: false, points: [] },
};

export const VideoReviewSlice = createSlice({
  name: "videoReview",
  initialState,
  reducers: {
    setCurrentReview: (state, action) => {
      state.id = action.payload.version;
      state.versionName = action.payload.version;
      state.video = action.payload.video;
      state.comments = action.payload.comments;
    },
    setPlayerMarkers: (state, action) => {
      state.playerMarkers.points = [];
      state.playerMarkers.enabled = false;
      state.isPlayerReady = false;

      const regex = /\[\[(.*?)\]\]/g;
      console.log("action.payload", action.payload);
      const messages = action.payload;
      messages.forEach((message: any) => {
        if (message.message.match(regex)) {
          console.log("match", message.message.match(regex));
          const time = message.message
            .match(regex)[0]
            .replace("[[", "")
            .replace("]]", "");

          state.playerMarkers.points.push({
            time: videoTimeDeserializer(time),
            label: message.message,
          });
        }
      });

      if (state.playerMarkers.points.length > 0) {
        state.playerMarkers.enabled = true;
      }

      state.isPlayerReady = true;
    },
  },
});

export const { setCurrentReview, setPlayerMarkers } = VideoReviewSlice.actions;

export default VideoReviewSlice.reducer;
