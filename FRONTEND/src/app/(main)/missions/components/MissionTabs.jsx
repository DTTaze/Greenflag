import React from "react";

/**
 * Tab navigation component for the mission page
 * Allows switching between daily tasks and other tasks
 */
const MissionTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="bg-white rounded-t-xl border border-gray-200 p-1 shadow-sm">
      <div className="flex">
        <button
          className={`tab flex-1 py-3 text-center rounded-lg font-medium transition-all duration-200 ${
            selectedTab === "daily"
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedTab("daily")}
        >
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Nhiệm Vụ Hàng Ngày
          </div>
        </button>
        <button
          className={`tab flex-1 py-3 text-center rounded-lg font-medium transition-all duration-200 ${
            selectedTab === "other"
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedTab("other")}
        >
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Nhiệm Vụ Khác
          </div>
        </button>
        <button
          className={`tab flex-1 py-3 text-center rounded-lg font-medium transition-all duration-200 ${
            selectedTab === "completed"
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedTab("completed")}
        >
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            Nhiệm Vụ Đã Hoàn Thành
          </div>
        </button>
      </div>
    </div>
  );
};

export default MissionTabs;
