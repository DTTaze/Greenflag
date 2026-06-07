"use client";

import React, { useContext } from "react";
import AllItemsTab from "@/src/components/features/exchangemarket/AllItemsTab";
import { MarketplaceContext } from "../layout";

export default function Page() {
  const { fetchAllItems } = useContext(MarketplaceContext);
  return <AllItemsTab fetchItems={fetchAllItems} />;
}
