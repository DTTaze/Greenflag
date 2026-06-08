import React from "react";

import CoinImg from "@/src/assets/images/Coin";
import Timer from "@/src/assets/images/Timer";

export default function StatsSection({ video, task, userStats, coins, timer }) {
  const onReceiveCoins = () => {
    // onReceiveCoins placeholder
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
