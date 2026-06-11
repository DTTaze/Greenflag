import { ArrowRight, Gift, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

import GlobalSearchBar from "@/src/components/common/GlobalSearchBar";
import PageHeader from "@/src/components/common/PageHeader";
import { MarketplaceContext } from "../../layout";

function CatalogHeader() {
  const { marketSearchText, setMarketSearchText } = useContext(MarketplaceContext) || {};
  const t = useTranslations("exchangeMarket");

  return (
    <PageHeader
      title={t("header.title")}
      subtitle={t("header.desc")}
      theme="green"
      icon={Leaf}
      badges={
        <>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
            <Gift className="h-4 w-4 text-lime-200" />
            {t("header.tagGift")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
            {t("header.tagEasy")}
            <ArrowRight className="h-4 w-4" />
          </span>
        </>
      }
      rightContent={
        <GlobalSearchBar
          value={marketSearchText || ""}
          onChange={setMarketSearchText}
          placeholder="Tìm sản phẩm xanh, người bán..."
          aria-label="Tìm kiếm sản phẩm"
        />
      }
    />
  );
}

export default CatalogHeader;
