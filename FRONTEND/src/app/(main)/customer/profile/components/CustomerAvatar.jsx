import React from "react";
import { Camera } from "lucide-react";

export default function CustomerAvatar({ userInfo, avatarUploading, handleAvatarChange }) {
  return (
    <div className="relative flex flex-col items-center mt-[-48px] mb-4 z-10">
      {avatarUploading ? (
        <div className="w-[120px] h-[120px] rounded-full bg-white/80 border-4 border-white flex items-center justify-center shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={userInfo?.avatar_url || "/src/assets/images/default-avatar.jpg"}
            alt={userInfo?.full_name || "User"}
            className="w-[120px] h-[120px] rounded-full border-4 border-white object-cover shadow-md"
          />
          <label className="absolute bottom-0 right-0 p-2 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 rounded-full border border-emerald-100 shadow-sm cursor-pointer transition-colors duration-150">
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatarChange}
            />
            <Camera className="w-4 h-4" />
          </label>
        </div>
      )}
    </div>
  );
}
