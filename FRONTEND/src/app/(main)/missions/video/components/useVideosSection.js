import { createRef, useEffect, useRef, useState } from "react";

import { initialVideoData, taskData, userStats } from "./videoConfig";

export default function useVideosSection() {
  const [videoData, setVideoData] = useState(initialVideoData);
  const [user, setUser] = useState({
    id: 1,
    username: "user1",
    coins: { amount: 0 },
  });
  const [playingStates, setPlayingStates] = useState(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [tooltipTime, setTooltipTime] = useState("00:00");

  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const progressBarRef = useRef(null);

  // Mảng ref cho ReactPlayer và container
  const videoRefs = useRef(videoData.map(() => createRef()));
  const containerRefs = useRef(videoData.map(() => createRef()));
  const observerRef = useRef(null);

  // Format time display (seconds -> MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle play/pause toggle anywhere on video
  const togglePlay = (e) => {
    if (
      e &&
      (e.target.closest(".interaction-buttons") ||
        e.target.closest(".video-description") ||
        e.target.closest(".eco-tag") ||
        e.target.closest(".video-controls") ||
        e.target.closest(".video-progress"))
    ) {
      return;
    }
    setIsActuallyPlaying(!isActuallyPlaying);
  };

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle progress bar interactions
  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || playingStates === null) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max(offsetX / width, 0), 1);

    setProgress(percentage * 100);
    if (videoRefs.current[playingStates].current) {
      videoRefs.current[playingStates].current.seekTo(percentage * duration);
    }
  };

  // Handle progress bar mouse move (for tooltip)
  const handleProgressBarMouseMove = (e) => {
    if (!progressBarRef.current || playingStates === null) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max(offsetX / width, 0), 1);
    const timeAtPosition = percentage * duration;

    setTooltipPosition(offsetX);
    setTooltipTime(formatTime(timeAtPosition));
  };

  // Handle mouse move during dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      handleProgressBarMouseMove(e);
      handleProgressBarClick(e);
    }
  };

  // Handle mouse up (end dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle progress bar mouse down (start dragging)
  const handleProgressBarMouseDown = (e) => {
    setIsDragging(true);
    handleProgressBarClick(e);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Update progress based on current time
  const handleProgress = (state) => {
    if (playingStates !== null && !isDragging) {
      setCurrentTime(state.playedSeconds);
      const progressPercent = (state.playedSeconds / duration) * 100;
      setProgress(progressPercent);
    }
  };

  // Set duration when video is ready
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Hàm cập nhật số lượt like
  const updateLike = (index, isLiked) => {
    setVideoData((prevData) => {
      const newData = [...prevData];
      const currentLikes = newData[index].likes;
      newData[index] = {
        ...newData[index],
        likes: isLiked ? currentLikes + 1 : currentLikes - 1,
      };
      return newData;
    });
  };

  const handleShare = async (videoId) => {
    try {
      await navigator.share({
        title: "Check out this eco-friendly video!",
        text: "Watch this amazing video about protecting our environment",
        url: window.location.href,
      });
      setVideoData((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, shares: video.shares + 1 } : video,
        ),
      );
    } catch (error) {
      console.log("Error sharing:", error);
      setVideoData((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, shares: video.shares + 1 } : video,
        ),
      );
    }
  };

  // Xử lý sự kiện scroll để chỉ chuyển giữa các video
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;

      if (playingStates !== null) {
        const nextIndex = playingStates + direction;
        if (nextIndex >= 0 && nextIndex < videoData.length) {
          if (videoRefs.current[playingStates].current) {
            videoRefs.current[playingStates].current.seekTo(0);
          }
          containerRefs.current[nextIndex].current.scrollIntoView({
            behavior: "smooth",
          });
          setPlayingStates(nextIndex);
          setIsActuallyPlaying(true);
        }
      }
    };

    const container = document.querySelector(".video-section-container");
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [videoData.length, playingStates]);

  // Đồng bộ isTimerRunning với trạng thái thực tế của video
  useEffect(() => {
    if (isActuallyPlaying && playingStates !== null) {
      setIsTimerRunning(true);

      if (!progressIntervalRef.current) {
        setProgress(0);
        progressIntervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
              return 0;
            }
            return prev + 1;
          });
        }, 300);
      }
    } else {
      setIsTimerRunning(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [isActuallyPlaying, playingStates]);

  // Logic đồng hồ đếm ngược
  useEffect(() => {
    if (isTimerRunning) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setUser((prevUser) => ({
                ...prevUser,
                coins: { amount: prevUser.coins.amount + 3 },
              }));
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // IntersectionObserver: active video detection
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeIndex = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeIndex = containerRefs.current.findIndex(
              (ref) => ref.current === entry.target,
            );
          }
        });

        if (activeIndex !== null && activeIndex !== playingStates) {
          videoRefs.current.forEach((ref) => {
            if (ref.current) {
              ref.current.seekTo(0);
            }
          });
          setPlayingStates(activeIndex);
          setIsActuallyPlaying(true);
        }

        if (activeIndex === null && playingStates !== null) {
          setPlayingStates(null);
          setIsActuallyPlaying(false);
        }
      },
      { threshold: 0.75 },
    );

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [playingStates]);

  useEffect(() => {
    containerRefs.current.forEach((ref) => {
      if (ref.current && observerRef.current) {
        observerRef.current.observe(ref.current);
      }
    });
  }, [videoData]);

  return {
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
  };
}
