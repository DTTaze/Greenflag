import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  trend?: {
    value: string;
    icon: React.ReactNode;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

export default function StatCard({
  icon,
  title,
  value,
  unit,
  trend,
  action,
  accentColor,
  bgColor,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border ${borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800`}
      style={{ "--hover-border": accentColor } as React.CSSProperties}
    >
      <div
        className={`absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full ${bgColor} transition-transform group-hover:scale-150 dark:opacity-20`}
      />
      <div className="relative z-10">
        <div
          className={`mb-4 inline-flex rounded-lg ${bgColor} p-3 ${accentColor} dark:opacity-90`}
        >
          {icon}
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${accentColor}`}
            >
              {trend.icon}
              <span>{trend.value}</span>
            </div>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`text-xs font-semibold ${accentColor} transition-colors hover:brightness-110 dark:brightness-125`}
            >
              {action.label} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
