"use client";

import React, { Suspense } from "react";
import Loader from "@/src/components/ui/Loader";
import SetupPassword from "./components/SetupPassword";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Loader />
        </div>
      }
    >
      <SetupPassword />
    </Suspense>
  );
}
