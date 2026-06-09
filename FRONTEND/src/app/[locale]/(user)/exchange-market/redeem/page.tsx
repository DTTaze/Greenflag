"use client";

import React, { useContext } from "react";

import RedeemTab from "../components/RedeemTab";
import { MarketplaceContext } from "../layout";

export default function Page() {
  const { fetchRedeemItems } = useContext(MarketplaceContext)!;
  return <RedeemTab fetchItems={fetchRedeemItems} />;
}
