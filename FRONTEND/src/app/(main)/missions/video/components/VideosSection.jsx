import React from "react";

import VideoPlayerCard from "./VideoPlayerCard";
import { VideoSectionProvider, useVideoSection } from "./VideoSectionContext";

function VideosSectionContent() {
  const { videoData } = useVideoSection();

  return (
    <div className="flex h-screen w-full justify-center overflow-hidden bg-white">
      <div className="relative h-screen w-full [scrollbar-width:none] overflow-hidden bg-white [&::-webkit-scrollbar]:hidden">
        {videoData.map((video, index) => (
          <VideoPlayerCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function VideosSection() {
  return (
    <VideoSectionProvider>
      <VideosSectionContent />
    </VideoSectionProvider>
  );
}
