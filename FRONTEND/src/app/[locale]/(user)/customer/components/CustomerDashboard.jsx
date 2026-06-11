"use client";

import { useAuthStore } from "@/src/store/auth/authStore";

import AchievementsSection from "./dashboard/AchievementsSection";
import QuickActionsGrid from "./dashboard/QuickActionsGrid";
import RecentActivities from "./dashboard/RecentActivities";
import StatsGrid from "./dashboard/StatsGrid";
import WelcomeBanner from "./dashboard/WelcomeBanner";

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const userInfo = user;

  return (
    <div className="space-y-6">
      <WelcomeBanner userName={userInfo?.full_name} />
      <StatsGrid coins={userInfo?.coins} />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivities />
        <AchievementsSection />
      </div>

      <QuickActionsGrid />
    </div>
  );
}
