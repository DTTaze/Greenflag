import React from "react";

import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";
import ShareButton from "./ShareButton";

import { useVideoSection } from "./VideoSectionContext";

export default function InteractWithVideo({ video, index }) {
  const { updateLike, handleShare: onShare } = useVideoSection();
  const videoId = video?.id;
  return (
    <div className="absolute right-4 bottom-[120px] z-10 flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1">
        <HeartButton
          initialLikes={video.likes}
          onLike={(isLiked) => updateLike(index, isLiked)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-black/50 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#0b6e4f]/80"
        />
        <div className="mt-1 text-center text-[12px] text-white">
          {video.likes}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <CommentButton
          comments={video.comments}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-black/50 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#0b6e4f]/80"
        />
        <div className="mt-1 text-center text-[12px] text-white">
          {video.comments}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <ShareButton
          onShare={() => onShare(videoId)}
          VideoId={videoId}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-black/50 text-white backdrop-blur-[5px] transition-all duration-200 hover:scale-110 hover:bg-[#0b6e4f]/80"
        />
        <div className="mt-1 text-center text-[12px] text-white">
          {video.shares}
        </div>
      </div>
    </div>
  );
}
