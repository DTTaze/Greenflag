import React, { useEffect, useState } from "react";

import Heart from "@/src/assets/images/Heart";

export default function HeartButton({ initialLikes, onLike }) {
  const [heart, setHeart] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = () => {
    setHeart(!heart);
    if (heart) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    onLike(!heart);
  };

  return (
    <button
      className={`flex flex-col items-center gap-1 rounded-full p-3 backdrop-blur-md transition-colors ${
        heart
          ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
      onClick={handleLike}
    >
      <Heart color={heart ? "#FF0000" : "#808080"} />
      <div className="mt-1 text-sm text-white">{likes}</div>
    </button>
  );
}
