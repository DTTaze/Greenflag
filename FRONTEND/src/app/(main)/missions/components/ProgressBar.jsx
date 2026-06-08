import React from "react";

/**
 * Progress bar component for task completion
 * @param {Object} props
 * @param {number} props.completed - Number of completed steps
 * @param {number} props.total - Total number of steps
 * @param {string} props.level - Difficulty level (easy, medium, hard, expert)
 */
const ProgressBar = React.memo(({ completed, total, level }) => {
  const percentage = Math.round((completed / total) * 100);
  const bgClass = level === "easy" 
    ? "bg-green-500" 
    : level === "medium" 
      ? "bg-blue-500" 
      : level === "hard" 
        ? "bg-orange-500" 
        : "bg-red-500";
  
  const bgLightClass = level === "easy" 
    ? "bg-green-100" 
    : level === "medium" 
      ? "bg-blue-100" 
      : level === "hard" 
        ? "bg-orange-100" 
        : "bg-red-100";
        
  return (
    <div className="progress-container">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Tiến độ</span>
        <span className="text-xs font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className={`w-full h-2 rounded-full ${bgLightClass}`}>
        <div
          className={`h-full rounded-full ${bgClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

export default ProgressBar;
