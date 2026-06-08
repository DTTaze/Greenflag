import React from "react";

export default function DescriptionVideo({ video }) {
  return (
    <div className="video-user-info">
      <div className="user-avatar">
        <img
          src={video.postedBy.avatar}
          alt={`${video.postedBy.username}'s avatar`}
          onError={(e) => {
            e.target.src = "https://placehold.co/48x48";
          }}
        />
      </div>
      <div className="video-info">
        <h4>{video.postedBy.username}</h4>
        <p>{video.caption}</p>
      </div>
    </div>
  );
}
