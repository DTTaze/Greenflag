"use client";

import React, { useContext } from "react";
import UserItemsTab from "../components/UserItemsTab";
import { MarketplaceContext } from "../layout";

export default function Page() {
  const { fetchMyItems } = useContext(MarketplaceContext);
  return <UserItemsTab fetchItems={fetchMyItems} />;
}
