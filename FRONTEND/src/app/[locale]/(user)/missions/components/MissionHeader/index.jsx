import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import GlobalSearchBar from "@/src/components/common/GlobalSearchBar";
import PageHeader from "@/src/components/common/PageHeader";

/**
 * Header component for the mission page
 */
const MissionHeader = ({
  userInfo,
  loading,
  searchQuery,
  setSearchQuery,
}) => {
  const t = useTranslations("missions.header");

  if (loading) {
    return (
      <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-[2rem] bg-gradient-to-r from-emerald-600 to-emerald-500 p-7 text-white shadow-lg sm:flex-row">
        <div>
          <div className="mb-2.5 h-8 w-56 rounded bg-white/20"></div>
          <div className="h-4 w-80 rounded bg-white/20"></div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0">
          <div className="h-10 w-64 rounded-full bg-white/20"></div>
        </div>
      </div>
    );
  }

  return (
    <PageHeader
      title={t("title")}
      subtitle={t("subtitle")}
      theme="emerald"
      icon={Sparkles}
      rightContent={
        <GlobalSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm nhiệm vụ xanh..."
          aria-label="Tìm kiếm nhiệm vụ"
        />
      }
    />
  );
};

export default MissionHeader;
