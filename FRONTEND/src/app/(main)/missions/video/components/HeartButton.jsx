import React, { useState, useEffect } from "react";
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
      className={`backdrop-blur-md p-3 rounded-full transition-colors flex flex-col items-center gap-1 ${
                  heart 
                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
      onClick={handleLike}
    >
      <Heart color={heart ? "#FF0000" : "#808080"} />
      <div className="text-white text-sm mt-1">{likes}</div>
    </button>
  );
}
