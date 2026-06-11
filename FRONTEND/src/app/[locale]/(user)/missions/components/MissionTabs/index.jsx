import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ListTodo } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

/**
 * Tab navigation component for the mission page
 */
const MissionTabs = ({ selectedTab, setSelectedTab }) => {
  const t = useTranslations("missions.tabs");
  const tabs = [
    { id: "daily", label: t("daily"), icon: CalendarDays },
    { id: "other", label: t("other"), icon: ListTodo },
    { id: "completed", label: t("completed"), icon: CheckCircle2 },
  ];

  return (
    <div className="mb-6 max-w-2xl rounded-xl border border-emerald-200/70 bg-emerald-100/60 p-1.5 shadow-lg backdrop-blur-md">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = selectedTab === id;
          return (
            <button
              key={id}
              className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-lg py-3 text-center text-xs font-bold transition-colors duration-300 sm:text-sm ${
                isActive
                  ? "text-[#0B6E4F]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setSelectedTab(id)}
            >
              <Icon
                className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? "scale-110 text-[#0B6E4F]" : "text-gray-400"}`}
              />
              <span className="hidden md:inline">{label}</span>
              <span className="inline md:hidden">
                {id === "daily"
                  ? t("dailyShort")
                  : id === "other"
                    ? t("otherShort")
                    : t("completedShort")}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeMissionTab"
                  className="absolute inset-0 -z-10 rounded-lg border border-gray-200/20 bg-white shadow-xs"
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
