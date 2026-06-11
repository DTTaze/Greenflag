import React from "react";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  color: string;
}

export default function ActivityItem({
  icon,
  title,
  date,
  color,
}: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className={`rounded-lg p-2.5 ${color} dark:opacity-80`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
}
