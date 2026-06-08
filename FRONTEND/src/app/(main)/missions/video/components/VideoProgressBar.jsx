import React from "react";

import { useVideoSection } from "./VideoSectionContext";

export default function VideoProgressBar({ index }) {
  const {
    playingStates,
    isDragging,
    progressBarRef,
    handleProgressBarClick,
    handleProgressBarMouseDown,
    handleProgressBarMouseMove,
    setTooltipTime,
    tooltipTime,
    tooltipPosition,
    duration,
    formatTime,
    progress,
  } = useVideoSection();

  if (index !== playingStates) return null;

  return (
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
  );
}
