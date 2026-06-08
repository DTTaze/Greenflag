import { Share2 } from "lucide-react";
import React from "react";

export default function ShareButton({ onShare, VideoId }) {
  return (
    <>
      <button
        className="flex flex-col items-center gap-1 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        onClick={() => onShare(VideoId)}
      >
        <Share2 size={24} color="#ffffff" />
      </button>
    </>
  );
}
