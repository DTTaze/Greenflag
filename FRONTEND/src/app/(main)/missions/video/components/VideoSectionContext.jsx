import React, { createContext, useContext } from "react";

import useVideosSection from "./useVideosSection";

const VideoSectionContext = createContext(null);

export function VideoSectionProvider({ children }) {
  const value = useVideosSection();
  return (
    <VideoSectionContext.Provider value={value}>
      {children}
    </VideoSectionContext.Provider>
  );
}

export function useVideoSection() {
  const context = useContext(VideoSectionContext);
  if (!context) {
    throw new Error(
      "useVideoSection must be used within a VideoSectionProvider",
    );
  }
  return context;
}
