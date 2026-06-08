import React from "react";

export default function DescriptionVideo({ video }) {
  return (
    <div className="absolute bottom-5 left-4 z-10 flex max-w-[70%] items-center gap-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-emerald-800/80 bg-white">
        <img
          src={video.postedBy.avatar}
          alt={`${video.postedBy.username}'s avatar`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/48x48";
          }}
        />
      </div>
      <div className="text-white">
        <h4 className="m-[0_0_4px_0] text-[16px] font-semibold">
          {video.postedBy.username}
        </h4>
        <p className="m-0 line-clamp-2 text-[14px] opacity-90">
          {video.caption}
        </p>
      </div>
    </div>
  );
}
