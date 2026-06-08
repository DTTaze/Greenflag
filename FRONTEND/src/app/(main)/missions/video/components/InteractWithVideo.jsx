import React from "react";

import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";
import ShareButton from "./ShareButton";

export default function InteractWithVideo({
  video,
  index,
  updateLike,
  onShare,
  videoId,
}) {
  return (
    <div className="interaction-buttons">
      <div className="interaction-button-container">
        <HeartButton
          initialLikes={video.likes}
          onLike={(isLiked) => updateLike(index, isLiked)}
          className="interaction-button"
        />
        <div className="interaction-count">{video.likes}</div>
      </div>

      <div className="interaction-button-container">
        <CommentButton
          comments={video.comments}
          className="interaction-button"
        />
        <div className="interaction-count">{video.comments}</div>
      </div>

      <div className="interaction-button-container">
        <ShareButton
          onShare={() => onShare(videoId)}
          VideoId={videoId}
          className="interaction-button"
        />
        <div className="interaction-count">{video.shares}</div>
      </div>
    </div>
  );
}
