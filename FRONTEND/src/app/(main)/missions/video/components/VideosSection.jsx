import "@/src/styles/components/VideoSection.css";

import React, { createRef, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import CoinImg from "@/src/assets/images/Coin";
import Timer from "@/src/assets/images/Timer";

import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";
import ShareButton from "./ShareButton";

// Component hiển thị stats trên bên trái màn hình
function StatsSection({ video, task, userStats, coins, timer }) {
  const onReceiveCoins = () => {
    // notification.success({
    //   message: "Received 3 EcoCoins!",
    //   description: "Thank you for contributing to a greener world!",
    // });
  };

  return (
    <div className="video-stats-sidebar">
      <div className="user-profile-section">
        <div className="profile-avatar-large">
          <img
            src={
              video?.postedBy?.avatar ||
              "https://placehold.co/80x80/0B6E4F/fff?text=G"
            }
            alt="User profile"
          />
        </div>
        <h3 className="profile-name">
          {video?.postedBy?.username || "EcoUser"}
        </h3>
        <p className="profile-bio">Environmental Activist</p>
        <button className="follow-button">Follow</button>
      </div>

      {/* Coins and Timer Display */}
      <div className="sidebar-coins-timer">
        <h4 className="stats-heading">Your Rewards</h4>
        <div className="coins-timer-container">
          {/* Coins Display */}
          <div
            className="sidebar-display-pill coin-pill"
            onClick={onReceiveCoins}
          >
            <CoinImg />
            <div className="pill-content">
              <span className="pill-label">EcoCoins</span>
              <span className="pill-value">{coins}</span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="sidebar-display-pill timer-pill">
            <Timer />
            <div className="pill-content">
              <span className="pill-label">Remaining</span>
              <span className="pill-value">{timer}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="task-stats-container">
        <h4 className="stats-heading">Eco Impact</h4>

        <div className="stats-item">
          <div className="stats-icon green-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stats-content">
            <span className="stats-label">Tasks Completed</span>
            <span className="stats-value">
              {userStats?.tasksCompleted || 12}
            </span>
          </div>
        </div>

        <div className="stats-item">
          <div className="stats-icon blue-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stats-content">
            <span className="stats-label">Watch Time</span>
            <span className="stats-value">
              {userStats?.watchTime || "45 min"}
            </span>
          </div>
        </div>

        <div className="stats-item">
          <div className="stats-icon leaf-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              <path d="M8 16l4-4 4 4" />
            </svg>
          </div>
          <div className="stats-content">
            <span className="stats-label">EcoPoints Earned</span>
            <span className="stats-value">{userStats?.ecoPoints || 150}</span>
          </div>
        </div>
      </div>

      <div className="current-task-info">
        <h4 className="stats-heading">Current Task</h4>
        <div className="task-card">
          <div className="task-tag">
            {video?.ecoTag || "Environmental Task"}
          </div>
          <h5 className="task-title">{task?.title || "Watch and Learn"}</h5>
          <p className="task-description">
            {task?.description ||
              "Watch this eco-friendly video to earn EcoCoins and learn how to make a difference."}
          </p>
          <div className="task-reward">
            <CoinImg />
            <span>{task?.reward || 3} EcoCoins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component hiển thị tương tác video theo UI mới
function InteractWithVideo({ video, index, updateLike, onShare, videoId }) {
  return (
    <div className="interaction-buttons">
      <div className="interaction-button-container">
        <HeartButton
          initialLikes={video.likes}
          onLike={(isLiked) => updateLike(index, isLiked)}
          className="interaction-button"
        />
        <div className="interaction-count">{video.likes}</div>
      </div>

      <div className="interaction-button-container">
        <CommentButton
          comments={video.comments}
          className="interaction-button"
        />
        <div className="interaction-count">{video.comments}</div>
      </div>

      <div className="interaction-button-container">
        <ShareButton
          onShare={() => onShare(videoId)}
          VideoId={videoId}
          className="interaction-button"
        />
        <div className="interaction-count">{video.shares}</div>
      </div>
    </div>
  );
}

// Component hiển thị thông tin video (avatar, username, caption) theo UI mới
function DescriptionVideo({ video }) {
  return (
    <div className="video-user-info">
      <div className="user-avatar">
        <img
          src={video.postedBy.avatar}
          alt={`${video.postedBy.username}'s avatar`}
          onError={(e) => (e.target.src = "https://placehold.co/48x48")}
        />
      </div>
      <div className="video-info">
        <h4>{video.postedBy.username}</h4>
        <p>{video.caption}</p>
      </div>
    </div>
  );
}

// Component chính: VideosSection
export default function VideosSection() {
  // Mock task data
  const taskData = {
    title: "Learn About Environmental Protection",
    description:
      "Watch this video to learn about environmental protection strategies and earn rewards.",
    reward: 3,
  };

  // Mock user stats
  const userStats = {
    tasksCompleted: 12,
    watchTime: "45 min",
    ecoPoints: 150,
  };

  // Khởi tạo dữ liệu video với nội dung bảo vệ môi trường
  const [videoData, setVideoData] = useState([
    {
      id: 1,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 120,
      comments: 45,
      shares: 0,
      caption:
        "Planting trees helps combat climate change! Join our eco-challenge today. 🌱🌎 #SaveThePlanet",
      postedBy: {
        username: "GreenEarth",
        avatar: "https://placehold.co/48x48/0B6E4F/fff?text=G",
      },
      ecoTag: "Tree Planting",
    },
    {
      id: 2,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 85,
      comments: 30,
      shares: 0,
      caption:
        "Beach cleanup makes a huge difference for marine life! Every piece of plastic collected matters. 🌊♻️ #OceanCleanup",
      postedBy: {
        username: "OceanGuardian",
        avatar: "https://placehold.co/48x48/10A56C/fff?text=O",
      },
      ecoTag: "Ocean Cleanup",
    },
    {
      id: 3,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 156,
      comments: 52,
      shares: 0,
      caption:
        "Reducing plastic waste at home is easier than you think! Check out these simple eco-friendly swaps. 🌿♻️ #ZeroWaste",
      postedBy: {
        username: "EcoWarrior",
        avatar: "https://placehold.co/48x48/7DCE82/fff?text=E",
      },
      ecoTag: "Zero Waste",
    },
  ]);

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

  // Sử dụng mảng ref cho ReactPlayer và container
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
    // Prevent toggling if clicking on interactive elements
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

    // Set progress and seek to time
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

    // Calculate time at current position
    const timeAtPosition = percentage * duration;

    // Update tooltip
    setTooltipPosition(offsetX);
    setTooltipTime(formatTime(timeAtPosition));
  };

  // Handle progress bar mouse down (start dragging)
  const handleProgressBarMouseDown = (e) => {
    setIsDragging(true);
    handleProgressBarClick(e);

    // Add event listeners for dragging
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
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

    // Remove event listeners
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Update progress based on current time
  const handleProgress = (state) => {
    if (playingStates !== null && !isDragging) {
      setCurrentTime(state.playedSeconds);
      // Calculate progress percentage
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
      // If Web Share API fails, increment share count anyway
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

      // Determine scroll direction
      const direction = e.deltaY > 0 ? 1 : -1;

      // Calculate the next video to show
      if (playingStates !== null) {
        const nextIndex = playingStates + direction;

        // Check if next index is valid
        if (nextIndex >= 0 && nextIndex < videoData.length) {
          // Stop current video
          if (videoRefs.current[playingStates].current) {
            videoRefs.current[playingStates].current.seekTo(0);
          }

          // Scroll to next video
          containerRefs.current[nextIndex].current.scrollIntoView({
            behavior: "smooth",
          });

          // Update playing state to the new index
          setPlayingStates(nextIndex);
          setIsActuallyPlaying(true);
        }
      }
    };

    // Add wheel event listener to the container
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

      // Start progress animation
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
        }, 300); // Roughly 30 seconds for full progress
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
                coins: prevUser.coins + 3,
              }));
              // notification.success({
              //   message: "Earned 3 EcoCoins!",
              //   description: "Thank you for watching eco-friendly content!",
              // });
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

  // IntersectionObserver: lựa chọn video có phần hiển thị nhiều nhất làm video active
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

        // Nếu tìm được video active khác với video đang phát thì cập nhật trạng thái
        if (activeIndex !== null && activeIndex !== playingStates) {
          // Pause all videos
          videoRefs.current.forEach((ref, i) => {
            if (ref.current) {
              ref.current.seekTo(0);
            }
          });

          // Set the new active video
          setPlayingStates(activeIndex);
          setIsActuallyPlaying(true);
        }

        // Nếu không có video nào đủ điều kiện thì dừng video đang active
        if (activeIndex === null && playingStates !== null) {
          setPlayingStates(null);
          setIsActuallyPlaying(false);
        }
      },
      { threshold: 0.75 },
    );

    // Cleanup observer khi component unmount
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [playingStates]);

  // Gắn observer cho container video khi chúng sẵn sàng
  useEffect(() => {
    containerRefs.current.forEach((ref) => {
      if (ref.current && observerRef.current) {
        observerRef.current.observe(ref.current);
      }
    });
  }, [videoData]);

  return (
    <div className="tiktok-layout-container">
      <div className="video-section-container">
        {videoData.map((video, index) => (
          <div
            key={video.id}
            ref={containerRefs.current[index]}
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
                ref={videoRefs.current[index]}
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
