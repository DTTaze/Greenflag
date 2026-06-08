"use client";

import React, { Suspense } from "react";

import Loader from "@/src/components/ui/Loader";
import ForgotPassword from "@/src/pages/ForgotPassword";

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
      <ForgotPassword />
    </Suspense>
  );
}
