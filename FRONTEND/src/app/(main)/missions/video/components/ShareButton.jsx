/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

import Sharing from "@/src/assets/images/Sharing";

export default function ShareButton({ onShare, VideoId }) {
  return (
    <>
      <button
        className="flex flex-col items-center gap-1 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        onClick={() => onShare(VideoId)}
      >
        <Sharing />
      </button>
    </>
  );
}
