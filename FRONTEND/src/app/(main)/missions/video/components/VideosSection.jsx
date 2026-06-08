import React from "react";
import ReactPlayer from "react-player";

import DescriptionVideo from "./DescriptionVideo";
import InteractWithVideo from "./InteractWithVideo";
import StatsSection from "./StatsSection";
import useVideosSection from "./useVideosSection";

export default function VideosSection() {
  const {
    taskData,
    userStats,
    videoData,
    user,
    playingStates,
    setPlayingStates,
    isActuallyPlaying,
    setIsActuallyPlaying,
    timer,
    progress,
    isMuted,
    currentTime,
    duration,
    isDragging,
    tooltipPosition,
    tooltipTime,
    setTooltipTime,
    progressBarRef,
    videoRefs,
    containerRefs,
    formatTime,
    togglePlay,
    toggleMute,
    handleProgressBarClick,
    handleProgressBarMouseDown,
    handleProgressBarMouseMove,
    handleProgress,
    handleDuration,
    updateLike,
    handleShare,
    isInitialized,
    setIsInitialized,
  } = useVideosSection();

  return (
    <div className="flex h-screen w-full justify-center overflow-hidden bg-white">
      <div className="relative h-screen w-full [scrollbar-width:none] overflow-hidden bg-white [&::-webkit-scrollbar]:hidden">
        {videoData.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => {
              if (containerRefs.current && containerRefs.current[index]) {
                containerRefs.current[index].current = el;
              }
            }}
            className="relative flex h-screen w-full overflow-hidden bg-white max-[576px]:flex-col"
          >
            {/* Left Sidebar: Stats, Tasks, and User Info */}
            <StatsSection
              video={video}
              task={taskData}
              userStats={userStats}
              coins={user.coins.amount}
              timer={timer}
            />

            {/* Center: Video */}
            <div className="group relative m-auto flex aspect-[9/16] h-[85vh] w-auto items-center justify-center overflow-hidden rounded-lg bg-black shadow-[0_4px_15px_rgba(0,0,0,0.1)] max-[576px]:order-1 max-[576px]:h-[50vh] max-[576px]:w-full">
              {/* Eco Tag */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded bg-emerald-800/80 px-2.5 py-1.25 text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{video.ecoTag}</span>
              </div>

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
                onProgress={
                  index === playingStates ? handleProgress : undefined
                }
                onDuration={
                  index === playingStates ? handleDuration : undefined
                }
              />

              {/* Clickable area for play/pause */}
              {index === playingStates && (
                <div
                  className="absolute top-0 left-0 z-10 h-full w-full cursor-pointer"
                  onClick={togglePlay}
                ></div>
              )}

              {/* Video controls */}
              {index === playingStates && (
                <>
                  {/* Video time display */}
                  <div className="absolute bottom-5 left-1/2 z-15 -translate-x-1/2 rounded-[12px] bg-black/60 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-[5px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Video controls */}
                  <div className="ease absolute right-0 bottom-[60px] left-0 z-15 flex items-center justify-center gap-5 p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {/* Rewind 10s */}
                    <button
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#10a56c]"
                      onClick={() =>
                        videoRefs.current[playingStates].current.seekTo(
                          Math.max(0, currentTime - 10),
                        )
                      }
                      aria-label="Rewind 10 seconds"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-[22px] w-[22px]"
                      >
                        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                      </svg>
                    </button>

                    {/* Play/Pause */}
                    <button
                      className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#10a56c]"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      aria-label={!isActuallyPlaying ? "Pause" : "Play"}
                    >
                      {!isActuallyPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[26px] w-[26px]"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[26px] w-[26px]"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Forward 10s */}
                    <button
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#10a56c]"
                      onClick={() =>
                        videoRefs.current[playingStates].current.seekTo(
                          Math.min(duration, currentTime + 10),
                        )
                      }
                      aria-label="Forward 10 seconds"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-[22px] w-[22px]"
                      >
                        <path d="M11.5 8c2.65 0 5.05.99 6.9 2.6L22 7v9h-9l3.62-3.62c-1.39-1.16-3.16-1.88-5.12-1.88-3.54 0-6.55 2.31-7.6 5.5l-2.37-.78C2.92 11.03 6.85 8 11.5 8z" />
                      </svg>
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#10a56c]"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      aria-label={!isMuted ? "Unmute" : "Mute"}
                    >
                      {!isMuted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[22px] w-[22px]"
                        >
                          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[22px] w-[22px]"
                        >
                          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Video progress bar with draggable functionality */}
              {index === playingStates && (
                <div
                  className={`ease group/progress absolute right-0 bottom-0 left-0 z-20 h-1 cursor-pointer bg-white/30 transition-[height] duration-200 hover:h-2 ${isDragging ? "h-2" : ""}`}
                  ref={progressBarRef}
                  onClick={handleProgressBarClick}
                  onMouseDown={handleProgressBarMouseDown}
                  onMouseMove={handleProgressBarMouseMove}
                  onMouseLeave={() => setTooltipTime(null)}
                >
                  {/* Time tooltip */}
                  {tooltipTime && (
                    <div
                      className={`pointer-events-none absolute bottom-5 z-25 -translate-x-1/2 rounded bg-black/70 px-2 py-1 text-[12px] whitespace-nowrap text-white transition-opacity duration-200 group-hover/progress:opacity-100 ${isDragging ? "opacity-100" : ""}`}
                      style={{ left: `${tooltipPosition}px` }}
                    >
                      {tooltipTime} / {formatTime(duration)}
                    </div>
                  )}

                  <div
                    className="relative h-full rounded-r bg-[var(--secondary-green,#10a56c)] after:absolute after:top-1/2 after:-right-1.5 after:h-3 after:w-3 after:-translate-y-1/2 after:rounded-full after:bg-[var(--secondary-green,#10a56c)] after:opacity-0 after:shadow-[0_0_4px_rgba(0,0,0,0.5)] after:transition-opacity after:duration-200 after:content-[''] group-hover/progress:after:opacity-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {/* Video overlay with dark gradient */}
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%] bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* Interaction buttons */}
              <InteractWithVideo
                video={video}
                index={index}
                updateLike={updateLike}
                onShare={handleShare}
                videoId={video.id}
              />

              {/* Video description */}
              <DescriptionVideo video={video} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
