"use client";

import React, { useContext } from "react";
import RedeemTab from "@/src/components/features/exchangemarket/RedeemTab";
import { MarketplaceContext } from "../layout";

export default function Page() {
  const { fetchRedeemItems } = useContext(MarketplaceContext);
  return <RedeemTab fetchItems={fetchRedeemItems} />;
}
