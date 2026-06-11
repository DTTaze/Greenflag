"use client";

import { Award } from "lucide-react";

import { achievements } from "../dashboardData";
import AchievementItem from "./AchievementItem";

export default function AchievementsSection() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
        <Award size={24} className="text-purple-600 dark:text-purple-300" />
        Achievements
      </h2>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            locked={achievement.locked}
            title={achievement.title}
            description={achievement.description}
          />
        ))}
      </div>
    </div>
  );
}
