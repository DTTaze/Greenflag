import React from "react";
import ReactPlayer from "react-player";

import DescriptionVideo from "./DescriptionVideo";
import EcoTag from "./EcoTag";
import InteractWithVideo from "./InteractWithVideo";
import StatsSection from "./StatsSection";
import VideoControls from "./VideoControls";
import VideoProgressBar from "./VideoProgressBar";
import { useVideoSection } from "./VideoSectionContext";

export default function VideoPlayerCard({ video, index }) {
  const {
    containerRefs,
    videoRefs,
    playingStates,
    isActuallyPlaying,
    isMuted,
    isInitialized,
    setPlayingStates,
    setIsActuallyPlaying,
    setIsInitialized,
    handleProgress,
    handleDuration,
    togglePlay,
  } = useVideoSection();

  return (
    <div
      ref={(el) => {
        if (containerRefs.current && containerRefs.current[index]) {
          containerRefs.current[index].current = el;
        }
      }}
      className="relative flex h-screen w-full overflow-hidden bg-white max-[576px]:flex-col"
    >
      {/* Left Sidebar: Stats, Tasks, and User Info */}
      <StatsSection video={video} />

      {/* Center: Video */}
      <div className="group relative m-auto flex aspect-[9/16] h-[85vh] w-auto items-center justify-center overflow-hidden rounded-lg bg-black shadow-[0_4px_15px_rgba(0,0,0,0.1)] max-[576px]:order-1 max-[576px]:h-[50vh] max-[576px]:w-full">
        {/* Eco Tag */}
        <EcoTag ecoTag={video.ecoTag} />

        {/* Video player */}
        <ReactPlayer
          url={video.url}
          playing={index === playingStates && isActuallyPlaying}
          loop={true}
          controls={false}
          width="100%"
          height="100%"
          muted={isMuted}
          ref={(el) => {
            if (videoRefs.current && videoRefs.current[index]) {
              videoRefs.current[index].current = el;
            }
          }}
          onReady={() => {
            if (index === 0 && !isInitialized) {
              setPlayingStates(0);
              setIsActuallyPlaying(true);
              videoRefs.current[0].current.seekTo(0);
              setIsInitialized(true);
            }
          }}
          onPlay={() => {
            if (index === playingStates) {
              setIsActuallyPlaying(true);
            }
          }}
          onPause={() => {
            if (index === playingStates) {
              setIsActuallyPlaying(false);
            }
          }}
          onEnded={() => {
            if (index === playingStates) {
              setIsActuallyPlaying(false);
            }
          }}
          onProgress={index === playingStates ? handleProgress : undefined}
          onDuration={index === playingStates ? handleDuration : undefined}
        />

        {/* Clickable area for play/pause */}
        {index === playingStates && (
          <div
            className="absolute top-0 left-0 z-10 h-full w-full cursor-pointer"
            onClick={togglePlay}
          ></div>
        )}

        {/* Video controls */}
        <VideoControls index={index} />

        {/* Video progress bar with draggable functionality */}
        <VideoProgressBar index={index} />

        {/* Video overlay with dark gradient */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%] bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* Interaction buttons */}
        <InteractWithVideo video={video} index={index} />

        {/* Video description */}
        <DescriptionVideo video={video} />
      </div>
    </div>
  );
}
