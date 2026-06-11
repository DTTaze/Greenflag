interface AchievementItemProps {
  locked: boolean;
  title: string;
  description: string;
}

export default function AchievementItem({
  locked,
  title,
  description,
}: AchievementItemProps) {
  return (
    <div
      className={`rounded-lg p-4 transition-all ${
        locked
          ? "border border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:opacity-60"
          : "border border-purple-100 bg-purple-50 dark:border-purple-700 dark:bg-purple-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-lg p-2 text-lg ${
            locked
              ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400"
              : "bg-purple-200 text-purple-600 dark:bg-purple-800 dark:text-purple-300"
          }`}
        >
          {locked ? "🔒" : "⭐"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
