import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ListTodo } from "lucide-react";
import React from "react";

/**
 * Tab navigation component for the mission page
 */
const MissionTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { id: "daily", label: "Nhiệm Vụ Hàng Ngày", icon: CalendarDays },
    { id: "other", label: "Nhiệm Vụ Khác", icon: ListTodo },
    { id: "completed", label: "Đã Hoàn Thành", icon: CheckCircle2 },
  ];

  return (
    <div className="mb-6 max-w-2xl rounded-xl border border-gray-200/50 bg-gray-100/50 p-1.5 shadow-2xs backdrop-blur-md">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = selectedTab === id;
          return (
            <button
              key={id}
              className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-lg py-3 text-center text-xs sm:text-sm font-bold transition-colors duration-300 ${
                isActive
                  ? "text-[#0B6E4F]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setSelectedTab(id)}
            >
              <Icon
                className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? "text-[#0B6E4F] scale-110" : "text-gray-400"}`}
              />
              <span className="hidden md:inline">{label}</span>
              <span className="inline md:hidden">
                {id === "daily"
                  ? "Hàng ngày"
                  : id === "other"
                    ? "Nhiệm vụ khác"
                    : "Đã xong"}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeMissionTab"
                  className="absolute inset-0 -z-10 rounded-lg bg-white shadow-xs border border-gray-200/20"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
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
