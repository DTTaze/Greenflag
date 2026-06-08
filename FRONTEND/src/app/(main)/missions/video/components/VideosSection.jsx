import "@/src/styles/components/VideoSection.css";

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
    <div className="tiktok-layout-container">
      <div className="video-section-container">
        {videoData.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => {
              if (containerRefs.current && containerRefs.current[index]) {
                containerRefs.current[index].current = el;
              }
            }}
            className="video-card"
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
            <div className="center-video-container">
              {/* Eco Tag */}
              <div className="eco-tag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
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
                <div className="video-click-area" onClick={togglePlay}></div>
              )}

              {/* Video controls */}
              {index === playingStates && (
                <>
                  {/* Video time display */}
                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Video controls */}
                  <div className="video-controls">
                    {/* Rewind 10s */}
                    <button
                      className="control-button"
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
                      >
                        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                      </svg>
                    </button>

                    {/* Play/Pause */}
                    <button
                      className="control-button play-pause-button"
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
                      className="control-button"
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
                      >
                        <path d="M11.5 8c2.65 0 5.05.99 6.9 2.6L22 7v9h-9l3.62-3.62c-1.39-1.16-3.16-1.88-5.12-1.88-3.54 0-6.55 2.31-7.6 5.5l-2.37-.78C2.92 11.03 6.85 8 11.5 8z" />
                      </svg>
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      className="control-button"
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
                        >
                          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
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
                  className={`video-progress ${isDragging ? "dragging" : ""}`}
                  ref={progressBarRef}
                  onClick={handleProgressBarClick}
                  onMouseDown={handleProgressBarMouseDown}
                  onMouseMove={handleProgressBarMouseMove}
                  onMouseLeave={() => setTooltipTime(null)}
                >
                  {/* Time tooltip */}
                  {tooltipTime && (
                    <div
                      className="time-tooltip"
                      style={{ left: `${tooltipPosition}px` }}
                    >
                      {tooltipTime} / {formatTime(duration)}
                    </div>
                  )}

                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {/* Video overlay with dark gradient */}
              <div className="video-overlay"></div>

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
