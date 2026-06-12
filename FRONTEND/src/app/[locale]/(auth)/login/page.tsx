"use client";

import { Suspense } from "react";
import LoginPage from "./components/Login";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
