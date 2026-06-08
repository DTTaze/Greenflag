import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ListTodo } from "lucide-react";
import React from "react";

/**
 * Tab navigation component for the mission page
 * Allows switching between daily tasks and other tasks
 */
const MissionTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { id: "daily", label: "Nhiệm Vụ Hàng Ngày", icon: CalendarDays },
    { id: "other", label: "Nhiệm Vụ Khác", icon: ListTodo },
    { id: "completed", label: "Nhiệm Vụ Đã Hoàn Thành", icon: CheckCircle2 },
  ];

  return (
    <div className="mb-6 max-w-2xl rounded-xl border border-gray-200/40 bg-gray-100/80 p-1 shadow-2xs">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = selectedTab === id;
          return (
            <button
              key={id}
              className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-center text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-[#0B6E4F]"
                  : "text-gray-600 hover:text-[#0B6E4F]"
              }`}
              onClick={() => setSelectedTab(id)}
            >
              <Icon
                className={`h-4.5 w-4.5 ${isActive ? "text-[#0B6E4F]" : "text-gray-400"}`}
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="inline sm:hidden">
                {id === "daily"
                  ? "Hàng ngày"
                  : id === "other"
                    ? "Khác"
                    : "Đã xong"}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeMissionTab"
                  className="absolute inset-0 -z-10 rounded-lg bg-white shadow-xs"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MissionTabs;
